import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import {
  fallbackGetSupplierByTenantIdFromSRMDB,
  fallbackGetAllRFQsFromSRMDB,
  fallbackGetAllDirectRFQsFromSRMDB,
  fallbackGetRFQsByIndustryIdFromSRMDB,
  fallbackGetDirectRFQsByIndustryIdFromSRMDB,
  fallbackGetRFQWinningItemCountByRFQIdFromSRMDB,
  fallbackGetWinningOffersByParticipantIdFromSRMDB,
  fallbackGetRFQsBySupplierIdFromSRMDB,
  fallbackGetDirectRFQsBySupplierIdFromSRMDB,
  fallbackGetTotalRFQByStatusByIndustryIdFromSRMDB,
  fallbackGetTotalRFQByStatusBySupplierIdFromSRMDB,
  fallbackGetTotalDirectRFQByStatusByIndustryIdFromSRMDB,
  fallbackGetTotalDirectRFQByStatusBySupplierIdFromSRMDB,
  fallbackGetTotalRFQLastYearsByIndustryIdFromSRMDB,
  fallbackGetTotalRFQLastYearsBySupplierIdFromSRMDB,
  fallbackGetTotalDirectRFQLastYearsByIndustryIdFromSRMDB,
  fallbackGetTotalDirectRFQLastYearsBySupplierIdFromSRMDB,
  fallbackGetWinningRFQsBySupplierInDateRangeFromSRMDB,
  fallbackGetLostRFQsBySupplierInDateRangeFromSRMDB,
  fallbackGetAcceptedDirectRFQsByIndustryInRangeFromSRMDB,
  fallbackGetRejectedDirectRFQsByIndustryInRangeFromSRMDB,
  fallbackGetAllRFQParticipantsByRFQIdFromSRMDB,
  fallbackGetAllContractsByIndustryIdFromSRMDB,
  fallbackGetAllContractsBySupplierIdFromSRMDB,
  fallbackGetTopSuppliersByIndustryIdFromSRMDB,
  fallbackGetTopIndustriesBySupplierIdFromSRMDB,
  fallbackGetTopIndustryItemsByIndustryIdFromSRMDB,
  fallbackGetTopSupplierItemsByIndustryIdFromSRMDB,
  fallbackGetTopIndustryItemsBySupplierIdFromSRMDB,
  fallbackGetTopSupplierItemsBySupplierIdFromSRMDB,
  fallbackGetTotalHistoryShipmentByIndustryAndYearFromSRMDB,
  fallbackGetTotalHistoryShipmentBySupplierAndYearFromSRMDB,
  fallbackGetAllHistoryShipmentByIndustryForAllYearsFromSRMDB,
  fallbackGetAllHistoryShipmentBySupplierForAllYearsFromSRMDB,
  fallbackGetHistoryShipmentsLastYearsByIndustryFromSRMDB,
  fallbackGetHistoryShipmentsLastYearsBySupplierFromSRMDB,
  fallbackGetTotalTargetAndActualTotalPriceByIndustryAndYearFromSRMDB,
  fallbackGetTotalTargetAndActualTotalPriceBySupplierAndYearFromSRMDB,
  fallbackGetAllMasterContractMetricsByIndustryIdFromSRMDB,
  fallbackGetAllMasterContractMetricsBySupplierIdFromSRMDB,
  fallbackGetAllMasterContractMetricsInYearByIndustryIdFromSRMDB,
  fallbackGetAllMasterContractMetricsInYearBySupplierIdFromSRMDB,
} from '../business-layer/services/fallbackSRM.service';

// ================================
// SRM SUPPLIER PORTAL FUNCTIONS
// ================================

export const getSupplierByTenantIdViaRPC = async (
  req: Request,
  tenantId: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_supplier_by_tenant_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Supplier data via RabbitMQ for tenant ${tenantId}`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Supplier. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetSupplierByTenantIdFromSRMDB(tenantId);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Supplier data via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Supplier response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      tenant_id: tenantId,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

// ================================
// SRM PROCUREMENT FUNCTIONS
// ================================

export const getAllRFQsViaRPC = async (req: Request, criteria?: any) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_all_rfqs';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(`📡 [QMS Consumer] Requesting All RFQs data via RabbitMQ`);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for All RFQs. Falling back to SRM Database...',
      );
      try {
        const fallbackData = await fallbackGetAllRFQsFromSRMDB(criteria);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} RFQs via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing RFQs response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      criteria: criteria || {},
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getAllDirectRFQsViaRPC = async (req: Request, criteria?: any) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_all_direct_rfqs';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(`📡 [QMS Consumer] Requesting All Direct RFQs data via RabbitMQ`);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for All Direct RFQs. Falling back to SRM Database...',
      );
      try {
        const fallbackData = await fallbackGetAllDirectRFQsFromSRMDB(criteria);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Direct RFQs via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Direct RFQs response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      criteria: criteria || {},
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getRFQsByIndustryIdViaRPC = async (
  req: Request,
  industryId: number,
  criteria?: any,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_rfqs_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting RFQs by Industry ID ${industryId} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for RFQs by Industry. Falling back to SRM Database...',
      );
      try {
        const fallbackData = await fallbackGetRFQsByIndustryIdFromSRMDB(
          industryId,
          criteria,
        );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} RFQs for Industry ${industryId} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing RFQs by Industry response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_id: industryId,
      criteria: criteria || {},
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getDirectRFQsByIndustryIdViaRPC = async (
  req: Request,
  industryId: number,
  criteria?: any,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_direct_rfqs_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Direct RFQs by Industry ID ${industryId} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Direct RFQs by Industry. Falling back to SRM Database...',
      );
      try {
        const fallbackData = await fallbackGetDirectRFQsByIndustryIdFromSRMDB(
          industryId,
          criteria,
        );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Direct RFQs for Industry ${industryId} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Direct RFQs by Industry response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_id: industryId,
      criteria: criteria || {},
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getRFQWinningItemCountByRFQIdViaRPC = async (
  req: Request,
  rfqPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_rfq_winning_item_count_by_rfq_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting RFQ Winning Item Count for RFQ ${rfqPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for RFQ Winning Item Count. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetRFQWinningItemCountByRFQIdFromSRMDB(rfqPkid);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received RFQ Winning Item Count for RFQ ${rfqPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing RFQ Winning Item Count response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      rfq_pkid: rfqPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getWinningOffersByParticipantIdViaRPC = async (
  req: Request,
  rfqParticipantPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_winning_offers_by_participant_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Winning Offers for Participant ${rfqParticipantPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Winning Offers. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetWinningOffersByParticipantIdFromSRMDB(
            rfqParticipantPkid,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Winning Offers for Participant ${rfqParticipantPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Winning Offers response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      rfq_participant_pkid: rfqParticipantPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getRFQsBySupplierIdViaRPC = async (
  req: Request,
  supplierPkid: number,
  criteria?: any,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_rfqs_by_supplier_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting RFQs by Supplier ID ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for RFQs by Supplier. Falling back to SRM Database...',
      );
      try {
        const fallbackData = await fallbackGetRFQsBySupplierIdFromSRMDB(
          supplierPkid,
          criteria,
        );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} RFQs for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing RFQs by Supplier response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      criteria: criteria || {},
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getDirectRFQsBySupplierIdViaRPC = async (
  req: Request,
  supplierPkid: number,
  criteria?: any,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_direct_rfqs_by_supplier_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Direct RFQs by Supplier ID ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Direct RFQs by Supplier. Falling back to SRM Database...',
      );
      try {
        const fallbackData = await fallbackGetDirectRFQsBySupplierIdFromSRMDB(
          supplierPkid,
          criteria,
        );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Direct RFQs for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Direct RFQs by Supplier response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      criteria: criteria || {},
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTotalRFQByStatusByIndustryIdViaRPC = async (
  req: Request,
  industryId: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_total_rfq_by_status_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Total RFQ by Status for Industry ${industryId} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Total RFQ by Status. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTotalRFQByStatusByIndustryIdFromSRMDB(industryId);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Total RFQ by Status for Industry ${industryId} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Total RFQ by Status response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_id: industryId,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTotalRFQByStatusBySupplierIdViaRPC = async (
  req: Request,
  supplierPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_total_rfq_by_status_by_supplier_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Total RFQ by Status for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Total RFQ by Status. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTotalRFQByStatusBySupplierIdFromSRMDB(supplierPkid);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Total RFQ by Status for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Total RFQ by Status response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTotalDirectRFQByStatusByIndustryIdViaRPC = async (
  req: Request,
  industryPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_total_direct_rfq_by_status_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Total Direct RFQ by Status for Industry ${industryPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Total Direct RFQ by Status. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTotalDirectRFQByStatusByIndustryIdFromSRMDB(
            industryPkid,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Total Direct RFQ by Status for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Total Direct RFQ by Status response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTotalDirectRFQByStatusBySupplierIdViaRPC = async (
  req: Request,
  supplierPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_total_direct_rfq_by_status_by_supplier_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Total Direct RFQ by Status for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Total Direct RFQ by Status. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTotalDirectRFQByStatusBySupplierIdFromSRMDB(
            supplierPkid,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Total Direct RFQ by Status for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Total Direct RFQ by Status response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTotalRFQLastYearsByIndustryIdViaRPC = async (
  req: Request,
  industryPkid: number,
  range: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_total_rfq_last_years_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Total RFQ Last Years for Industry ${industryPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Total RFQ Last Years. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTotalRFQLastYearsByIndustryIdFromSRMDB(
            industryPkid,
            range,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Total RFQ Last Years for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Total RFQ Last Years response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      range: range,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTotalRFQLastYearsBySupplierIdViaRPC = async (
  req: Request,
  supplierPkid: number,
  range: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_total_rfq_last_years_by_supplier_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Total RFQ Last Years for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Total RFQ Last Years. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTotalRFQLastYearsBySupplierIdFromSRMDB(
            supplierPkid,
            range,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Total RFQ Last Years for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Total RFQ Last Years response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      range: range,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTotalDirectRFQLastYearsByIndustryIdViaRPC = async (
  req: Request,
  industryPkid: number,
  range: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_total_direct_rfq_last_years_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Total Direct RFQ Last Years for Industry ${industryPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Total Direct RFQ Last Years. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTotalDirectRFQLastYearsByIndustryIdFromSRMDB(
            industryPkid,
            range,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Total Direct RFQ Last Years for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Total Direct RFQ Last Years response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      range: range,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTotalDirectRFQLastYearsBySupplierIdViaRPC = async (
  req: Request,
  supplierPkid: number,
  range: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_total_direct_rfq_last_years_by_supplier_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Total Direct RFQ Last Years for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Total Direct RFQ Last Years. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTotalDirectRFQLastYearsBySupplierIdFromSRMDB(
            supplierPkid,
            range,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Total Direct RFQ Last Years for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Total Direct RFQ Last Years response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      range: range,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getWinningRFQsBySupplierInDateRangeViaRPC = async (
  req: Request,
  supplierPkid: number,
  startDate: string,
  endDate: string,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_winning_rfqs_by_supplier_in_date_range';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Winning RFQs for Supplier ${supplierPkid} in Date Range via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Winning RFQs by Supplier. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetWinningRFQsBySupplierInDateRangeFromSRMDB(
            supplierPkid,
            startDate,
            endDate,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Winning RFQs for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Winning RFQs response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      start_date: startDate,
      end_date: endDate,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getLostRFQsBySupplierInDateRangeViaRPC = async (
  req: Request,
  supplierPkid: number,
  startDate: string,
  endDate: string,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_lost_rfqs_by_supplier_in_date_range';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Lost RFQs for Supplier ${supplierPkid} in Date Range via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Lost RFQs by Supplier. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetLostRFQsBySupplierInDateRangeFromSRMDB(
            supplierPkid,
            startDate,
            endDate,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Lost RFQs for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Lost RFQs response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      start_date: startDate,
      end_date: endDate,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getAcceptedDirectRFQsByIndustryInRangeViaRPC = async (
  req: Request,
  industryPkid: number,
  range: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_accepted_direct_rfqs_by_industry_in_range';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Accepted Direct RFQs for Industry ${industryPkid} in Range via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Accepted Direct RFQs. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetAcceptedDirectRFQsByIndustryInRangeFromSRMDB(
            industryPkid,
            range,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Accepted Direct RFQs for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Accepted Direct RFQs response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      range: range,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getRejectedDirectRFQsByIndustryInRangeViaRPC = async (
  req: Request,
  industryPkid: number,
  range: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_rejected_direct_rfqs_by_industry_in_range';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Rejected Direct RFQs for Industry ${industryPkid} in Range via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Rejected Direct RFQs. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetRejectedDirectRFQsByIndustryInRangeFromSRMDB(
            industryPkid,
            range,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Rejected Direct RFQs for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Rejected Direct RFQs response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      range: range,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getAllRFQParticipantsByRFQIdViaRPC = async (
  req: Request,
  rfqPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_all_rfq_participants_by_rfq_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting All RFQ Participants for RFQ ${rfqPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for All RFQ Participants. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetAllRFQParticipantsByRFQIdFromSRMDB(rfqPkid);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} RFQ Participants for RFQ ${rfqPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing All RFQ Participants response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      rfq_pkid: rfqPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getAllMasterContractMetricsByIndustryIdViaRPC = async (
  req: Request,
  industryPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_all_master_contract_metrics_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting All Master Contract Metrics for Industry ${industryPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for All Master Contract Metrics. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetAllMasterContractMetricsByIndustryIdFromSRMDB(
            industryPkid,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received All Master Contract Metrics for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing All Master Contract Metrics response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getAllMasterContractMetricsBySupplierIdViaRPC = async (
  req: Request,
  supplierPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_all_master_contract_metrics_by_supplier_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting All Master Contract Metrics for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for All Master Contract Metrics. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetAllMasterContractMetricsBySupplierIdFromSRMDB(
            supplierPkid,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received All Master Contract Metrics for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing All Master Contract Metrics response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

// ================================
// SRM CONTRACT FUNCTIONS
// ================================

export const getAllContractsByIndustryIdViaRPC = async (
  req: Request,
  industryPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_all_contracts_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting All Contracts for Industry ${industryPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for All Contracts by Industry. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetAllContractsByIndustryIdFromSRMDB(industryPkid);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Contracts for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing All Contracts by Industry response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getAllContractsBySupplierIdViaRPC = async (
  req: Request,
  supplierPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_all_contracts_by_supplier_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting All Contracts for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for All Contracts by Supplier. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetAllContractsBySupplierIdFromSRMDB(supplierPkid);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Contracts for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing All Contracts by Supplier response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTopSuppliersByIndustryIdViaRPC = async (
  req: Request,
  industryPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_top_suppliers_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Top Suppliers for Industry ${industryPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Top Suppliers. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTopSuppliersByIndustryIdFromSRMDB(industryPkid);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Top Suppliers for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Top Suppliers response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTopIndustriesBySupplierIdViaRPC = async (
  req: Request,
  supplierPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_top_industries_by_supplier_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Top Industries for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Top Industries. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTopIndustriesBySupplierIdFromSRMDB(supplierPkid);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Top Industries for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Top Industries response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTopIndustryItemsByIndustryIdViaRPC = async (
  req: Request,
  industryPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_top_industry_items_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Top Industry Items for Industry ${industryPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Top Industry Items. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTopIndustryItemsByIndustryIdFromSRMDB(industryPkid);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Top Industry Items for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Top Industry Items response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTopSupplierItemsByIndustryIdViaRPC = async (
  req: Request,
  industryPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_top_supplier_items_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Top Supplier Items for Industry ${industryPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Top Supplier Items by Industry. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTopSupplierItemsByIndustryIdFromSRMDB(industryPkid);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Top Supplier Items for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Top Supplier Items by Industry response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTopIndustryItemsBySupplierIdViaRPC = async (
  req: Request,
  supplierPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_top_industry_items_by_supplier_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Top Industry Items for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Top Industry Items by Supplier. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTopIndustryItemsBySupplierIdFromSRMDB(supplierPkid);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Top Industry Items for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Top Industry Items by Supplier response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTopSupplierItemsBySupplierIdViaRPC = async (
  req: Request,
  supplierPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_top_supplier_items_by_supplier_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Top Supplier Items for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Top Supplier Items by Supplier. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTopSupplierItemsBySupplierIdFromSRMDB(supplierPkid);
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} Top Supplier Items for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Top Supplier Items by Supplier response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTotalHistoryShipmentByIndustryAndYearViaRPC = async (
  req: Request,
  industryPkid: number,
  startDate: Date,
  endDate: Date,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_total_history_shipment_by_industry_and_year';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Total History Shipment for Industry ${industryPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Total History Shipment by Industry. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTotalHistoryShipmentByIndustryAndYearFromSRMDB(
            industryPkid,
            startDate,
            endDate,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Total History Shipment for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Total History Shipment response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTotalHistoryShipmentBySupplierAndYearViaRPC = async (
  req: Request,
  supplierPkid: number,
  startDate: Date,
  endDate: Date,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_total_history_shipment_by_supplier_and_year';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Total History Shipment for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Total History Shipment by Supplier. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTotalHistoryShipmentBySupplierAndYearFromSRMDB(
            supplierPkid,
            startDate,
            endDate,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Total History Shipment for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Total History Shipment response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getAllHistoryShipmentByIndustryForAllYearsViaRPC = async (
  req: Request,
  industryPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_all_history_shipment_by_industry_for_all_years';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting All History Shipment for Industry ${industryPkid} for All Years via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for All History Shipment by Industry. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetAllHistoryShipmentByIndustryForAllYearsFromSRMDB(
            industryPkid,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} All History Shipment for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing All History Shipment response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getAllHistoryShipmentBySupplierForAllYearsViaRPC = async (
  req: Request,
  supplierPkid: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_all_history_shipment_by_supplier_for_all_years';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting All History Shipment for Supplier ${supplierPkid} for All Years via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for All History Shipment by Supplier. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetAllHistoryShipmentBySupplierForAllYearsFromSRMDB(
            supplierPkid,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received ${response?.length || 0} All History Shipment for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing All History Shipment response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getHistoryShipmentsLastYearsByIndustryViaRPC = async (
  req: Request,
  industryPkid: number,
  range: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_history_shipments_last_years_by_industry';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting History Shipments Last Years for Industry ${industryPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for History Shipments Last Years. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetHistoryShipmentsLastYearsByIndustryFromSRMDB(
            industryPkid,
            range,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received History Shipments Last Years for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing History Shipments Last Years response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      range: range,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getHistoryShipmentsLastYearsBySupplierViaRPC = async (
  req: Request,
  supplierPkid: number,
  range: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_history_shipments_last_years_by_supplier';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting History Shipments Last Years for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for History Shipments Last Years. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetHistoryShipmentsLastYearsBySupplierFromSRMDB(
            supplierPkid,
            range,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received History Shipments Last Years for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing History Shipments Last Years response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      range: range,
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTotalTargetAndActualTotalPriceByIndustryAndYearViaRPC = async (
  req: Request,
  industryPkid: number,
  startDate: Date,
  endDate: Date,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue =
    'rpc_get_total_target_and_actual_total_price_by_industry_and_year';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Total Target and Actual Price for Industry ${industryPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Total Target and Actual Price. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTotalTargetAndActualTotalPriceByIndustryAndYearFromSRMDB(
            industryPkid,
            startDate,
            endDate,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Total Target and Actual Price for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Total Target and Actual Price response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getTotalTargetAndActualTotalPriceBySupplierAndYearViaRPC = async (
  req: Request,
  supplierPkid: number,
  startDate: Date,
  endDate: Date,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue =
    'rpc_get_total_target_and_actual_total_price_by_supplier_and_year';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Total Target and Actual Price for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Total Target and Actual Price. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTotalTargetAndActualTotalPriceBySupplierAndYearFromSRMDB(
            supplierPkid,
            startDate,
            endDate,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received Total Target and Actual Price for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Total Target and Actual Price response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getAllMasterContractMetricsInYearByIndustryIdViaRPC = async (
  req: Request,
  industryPkid: number,
  startDate: Date,
  endDate: Date,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_all_master_contract_metrics_in_year_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting All Master Contract Metrics in Year for Industry ${industryPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for All Master Contract Metrics in Year. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetAllMasterContractMetricsInYearByIndustryIdFromSRMDB(
            industryPkid,
            startDate,
            endDate,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received All Master Contract Metrics in Year for Industry ${industryPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing All Master Contract Metrics in Year response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      industry_pkid: industryPkid,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};

export const getAllMasterContractMetricsInYearBySupplierIdViaRPC = async (
  req: Request,
  supplierPkid: number,
  startDate: Date,
  endDate: Date,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_all_master_contract_metrics_in_year_by_supplier_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting All Master Contract Metrics in Year for Supplier ${supplierPkid} via RabbitMQ`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for All Master Contract Metrics in Year. Falling back to SRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetAllMasterContractMetricsInYearBySupplierIdFromSRMDB(
            supplierPkid,
            startDate,
            endDate,
          );
        resolve(fallbackData);
      } catch (fallbackError) {
        console.error('❌ [QMS Consumer] Fallback failed:', fallbackError);
        reject(fallbackError);
      } finally {
        try {
          await channel.close();
          await connection.close();
        } catch (closeErr) {
          console.warn(
            '⚠️ [QMS Consumer] Warning: failed to close connection:',
            closeErr,
          );
        }
      }
    }, 5000);

    channel.consume(
      tempQueue.queue,
      async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(
              `✅ [QMS Consumer] Received All Master Contract Metrics in Year for Supplier ${supplierPkid} via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing All Master Contract Metrics in Year response:',
              parseErr,
            );
            reject(parseErr);
          } finally {
            try {
              await channel.close();
              await connection.close();
            } catch (closeErr) {
              console.warn(
                '⚠️ [QMS Consumer] Warning: closing after resolve failed:',
                closeErr,
              );
            }
          }
        }
      },
      { noAck: true },
    );

    const requestPayload = {
      supplier_pkid: supplierPkid,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      headers: {
        authorization: req.headers.authorization,
      },
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
      correlationId,
      replyTo: tempQueue.queue,
    });
  });
};
