import AWS from 'aws-sdk';
import ConnectedEmail from '~/models/connectedEmail';
import Campaign from '~/models/campaign';
import { Types } from 'mongoose';
import { Prospect } from '@/app/api/campaign/route';
import CampaignMail from '~/models/campaignMail';
import { awsEmailVerificationTemplate } from './emailHandler/emailTemplates/verifyAwsEmail';
import { paths } from '@/paths';
import transporter from './transporter';

// Config AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Initialize S3 client
const s3 = new AWS.S3();

const emailTemplates = {
  VERIFY_EMAIL: 'VerifyEmail',
};

// Function to upload the file buffer to S3
export const uploadToS3 = async (buffer: Buffer, key: string) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: `${key}.jpg`,
    Body: buffer,
    ContentType: 'image/jpeg',
  };

  try {
    // Upload the file to S3
    const data = await s3.upload(params).promise();
    return data.Location; // Return the URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Error uploading file to S3');
  }
};

// Function to extract the S3 key from the image URL
const getKeyFromUrl = (url: string) => {
  const urlParts = url.split('/');
  const key = urlParts.slice(3).join('/');
  return key;
};

// Function to delete the image from S3
export const deleteFromS3 = async (imageUrl: string) => {
  try {
    const key = getKeyFromUrl(imageUrl);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: key,
    };

    // Delete the object from S3
    await s3.deleteObject(params).promise();

    console.log(`Successfully deleted ${imageUrl} from S3.`);
    return { success: true, message: `Successfully deleted ${imageUrl}` };
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Error deleting file from S3');
  }
};

// Initialize AWS SES
const ses = new AWS.SES();

// export const verifyEmailAddress = async (email: string) => {
//   const params = {
//     EmailAddress: email,
//   };

//   try {
//     const result = await ses.verifyEmailAddress(params).promise();
//     return { status: true, data: result };
//   } catch (error) {
//     console.error('Error while sending verification mail:', error);
//     return {
//       status: false,
//     };
//   }
// };

export const checkEmailVerificationStatus = async (email: string) => {
  const params = {
    Identities: [email],
  };
  try {
    // checking verification status in DB
    const isVerified = await ConnectedEmail.findOne({ emailId: email });

    if (isVerified && isVerified?.verified) {
      return true;
    }
    const data = await ses.getIdentityVerificationAttributes(params).promise();
    const status = data.VerificationAttributes[email]?.VerificationStatus; // This could be 'Success', 'Pending', or 'Failed'
    if (status === 'Success') {
      await ConnectedEmail.findOneAndUpdate(
        { emailId: email },
        { verified: true }
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking verification status:', error);
    throw error;
  }
};

export const checkEmailListVerificationStatus = async (emails: string[]) => {
  const params = {
    Identities: emails, // List of emails to check
  };

  try {
    const data = await ses.getIdentityVerificationAttributes(params).promise();
    const results = [];

    for (const email of emails) {
      const status = data.VerificationAttributes[email]?.VerificationStatus; // 'Success', 'Pending', or 'Failed'

      if (status === 'Success') {
        // Update the verification status in MongoDB
        await ConnectedEmail.findOneAndUpdate(
          { emailId: email },
          { verified: true }
        );
      }

      // Fetch the updated email document (including all fields)
      const updatedEmailDoc = await ConnectedEmail.findOne({ emailId: email });
      results.push(updatedEmailDoc);
    }

    return results; // Return the list of complete email documents
  } catch (error) {
    throw error;
  }
};

export const sendBulkEmails = async (
  fromEmail: string,
  recipients: string[],
  subject: string,
  body: string,
  campaignId: Types.ObjectId
) => {
  const params = {
    Source: fromEmail, // User's verified email
    Destination: {
      ToAddresses: recipients,
    },
    Message: {
      Body: {
        Html: { Data: body },
      },
      Subject: { Data: subject },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    await Campaign.findByIdAndUpdate(campaignId, { status: 'Running' });
    console.log('Emails sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending emails:', error);
    throw error;
  }
};

export const sendCampaignEmails = async (
  fromEmail: string,
  prospects: Prospect[],
  subject: string,
  bodyTemplate: string,
  campaignId: Types.ObjectId,
  mailId: Types.ObjectId
) => {
  try {
    const mailDeliveryStatus = [];
    const updatedProspects: Prospect[] = [];
    for (let i = 0; i < prospects.length; i++) {
      const prospect = prospects[i];
      const recipantData = prospect.prospectData;

      let personalizedBody = bodyTemplate;
      Object.keys(recipantData).forEach((key) => {
        personalizedBody = personalizedBody.replace(
          `{{${key}}}`,
          recipantData[key]
        );
      });

      const params = {
        Source: fromEmail,
        Destination: {
          ToAddresses: [recipantData.EMAIL],
        },
        Message: {
          Body: {
            Html: { Data: personalizedBody },
          },
          Subject: { Data: subject },
        },
      };

      try {
        const result = await ses.sendEmail(params).promise();
        console.log(`Mail sent at: ${recipantData.EMAIL} ---`);
        console.log(result);
        mailDeliveryStatus.push({ EMAIL: recipantData.EMAIL, status: true });
        updatedProspects.push({
          ...prospect,
          isBounced: false,
          isDelivered: true,
          isRejected: false,
        });
      } catch (mailError) {
        console.log(`Error in sending mail at: ${recipantData.EMAIL} ---`);
        console.log(mailError);
        mailDeliveryStatus.push({ EMAIL: recipantData.EMAIL, status: false });
        updatedProspects.push({
          ...prospect,
          isBounced: false,
          isDelivered: false,
          isRejected: true,
        });
      }
    }

    // Update campaign status after sending emails
    await Campaign.findByIdAndUpdate(campaignId, { status: 'Running' });

    // Update campaignMail status after sending emails
    await CampaignMail.findByIdAndUpdate(mailId, {
      prospects: updatedProspects,
    });
  } catch (error) {
    console.error('Error sending emails', error);
    throw error;
  }
};

// export const sendSingleEmail = async (
//   fromEmail: string = process.env.OFFICIAL_FROM_MAIL || 'info@mirrorteams.com',
// recipient: string,
// subject: string,
// body: string
// ) => {
//   const params = {
//     Source: fromEmail,
//     Destination: {
//       ToAddresses: [recipient],
//     },
//     Message: {
//       Body: {
//         Html: { Data: body },
//       },
//       Subject: { Data: subject },
//     },
//   };

//   try {
//     const result = await ses.sendEmail(params).promise();
//     console.log('Email sent successfully:', result);
//     return result;
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };

export const sendSingleEmail = async (
  fromEmail = process.env.OFFICIAL_FROM_MAIL || 'info@mirrorteams.com',
  recipient: string,
  subject: string,
  body: string
) => {
  // Set email options
  const mailOptions = {
    from: fromEmail,
    to: recipient,
    subject: subject,
    html: body,
  };

  try {
    // Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Check if the template exists
const checkIfTemplateExists = async (templateName: string) => {
  try {
    await ses
      .getCustomVerificationEmailTemplate({ TemplateName: templateName })
      .promise();
    return true; // Template exists
  } catch (error: any) {
    if (
      error.code === 'NotFoundException' ||
      'CustomVerificationEmailTemplateDoesNotExist'
    ) {
      return false; // Template does not exist
    }
    throw error; // Other errors (e.g., network issues) should be handled differently
  }
};

// Create the custom verification email template
const createCustomVerificationTemplate = async () => {
  console.log(
    `${process.env.NEXT_PUBLIC_APP_URL}${paths.common.awsEmailVerifySuccess}`
  );
  console.log(
    `${process.env.NEXT_PUBLIC_APP_URL}${paths.common.awsEmailVerifyFail}`
  );
  const params = {
    TemplateName: emailTemplates.VERIFY_EMAIL,
    FromEmailAddress: process.env.OFFICIAL_FROM_MAIL || 'info@mirrorteams.com',
    TemplateSubject: 'Please verify your email address',
    TemplateContent: awsEmailVerificationTemplate(),
    SuccessRedirectionURL: `${process.env.NEXT_PUBLIC_APP_URL}${paths.common.awsEmailVerifySuccess}`,
    FailureRedirectionURL: `${process.env.NEXT_PUBLIC_APP_URL}${paths.common.awsEmailVerifyFail}`,
  };

  try {
    const result = await ses
      .createCustomVerificationEmailTemplate(params)
      .promise();
    console.log('Template created successfully:', result);
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

// Send the custom verification email
export const verifyEmailAddress = async (email: string) => {
  const templateName = emailTemplates.VERIFY_EMAIL; // The name of your template

  try {
    // Check if the template exists
    const templateExists = await checkIfTemplateExists(templateName);

    // If the template doesn't exist, create it
    if (!templateExists) {
      console.log('Template does not exist. Creating the template...');
      await createCustomVerificationTemplate();
    } else {
      console.log('Template already exists. Skipping creation.');
    }

    // Send the custom verification email
    const params = {
      EmailAddress: email,
      TemplateName: templateName,
    };

    const result = await ses.sendCustomVerificationEmail(params).promise();
    return { status: true, data: result };
  } catch (error) {
    console.error('Error while sending verification mail:', error);
    return { status: false, error };
  }
};
