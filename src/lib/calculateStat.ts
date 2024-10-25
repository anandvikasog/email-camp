export const calculateStat = (input: any = []) => {
  let total = 0;
  let delivered = 0;
  let bounced = 0;
  let rejected = 0;

  input.forEach((ip: any) => {
    ip.prospects.forEach((pr: any) => {
      total = total + 1;
      if (pr.isBounced) {
        bounced = bounced + 1;
      }
      if (pr.isDelivered) {
        delivered = delivered + 1;
      }
      if (pr.isRejected) {
        rejected = rejected + 1;
      }
    });
  });
  return {
    total: total,
    delivered: delivered,
    bounced: bounced,
    rejected: rejected,
  };
};
