import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import {
  fallbackGetLoRFromCRMDB,
  fallbackGetLoAFromCRMDB,
  fallbackGetContractsFromCRMDB,
  fallbackGetContractDetailsWithShipmentsFromCRMDB,
  fallbackGetContractByPkidFromCRMDB,
  fallbackGetAllContractsFromCRMDB,
  fallbackGetContractsByIndustryFromCRMDB,
  fallbackGetContractsByRetailFromCRMDB,
} from '../business-layer/services/fallbackCRM.service';
import type { CRMContractData } from '../business-layer/services/fallbackCRM.service';

// ================================
// TYPE DEFINITIONS
// ================================

interface RabbitMQCRMRequestPayload {
  tenant_id?: number;
  industry_id?: number;
  retail_id?: number;
  contract_pkid?: number;
  user_type?: 'industry' | 'retail';
  start_date?: string;
  end_date?: string;
  headers: {
    authorization?: string;
  };
}

// ================================
// EXISTING FUNCTIONS (unchanged)
// ================================

export const getLetterOfRequestsViaRPC = async (
  req: Request,
  startDate: Date,
  endDate: Date,
  tenantId: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_letter_of_requests';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting LoR data via RabbitMQ for tenant ${tenantId}`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for LoR. Falling back to CRM Database...',
      );
      try {
        const fallbackData = await fallbackGetLoRFromCRMDB(
          tenantId,
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
              `✅ [QMS Consumer] Received ${response.length} LoR records via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing LoR response:',
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

    const requestPayload: RabbitMQCRMRequestPayload = {
      tenant_id: tenantId,
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

export const getLetterOfAgreementsViaRPC = async (
  req: Request,
  startDate: Date,
  endDate: Date,
  tenantId: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_letter_of_agreements';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting LoA data via RabbitMQ for tenant ${tenantId}`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for LoA. Falling back to CRM Database...',
      );
      try {
        const fallbackData = await fallbackGetLoAFromCRMDB(
          tenantId,
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
              `✅ [QMS Consumer] Received ${response.length} LoA records via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing LoA response:',
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

    const requestPayload: RabbitMQCRMRequestPayload = {
      tenant_id: tenantId,
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

export const getContractsViaRPC = async (
  req: Request,
  startDate: Date,
  endDate: Date,
  tenantId: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_contracts';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Contract data via RabbitMQ for tenant ${tenantId}`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Contracts. Falling back to CRM Database...',
      );
      try {
        const fallbackData = await fallbackGetContractsFromCRMDB(
          tenantId,
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
              `✅ [QMS Consumer] Received ${response.length} Contract records via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Contract response:',
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

    const requestPayload: RabbitMQCRMRequestPayload = {
      tenant_id: tenantId,
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

export const getContractDetailsWithShipmentsViaRPC = async (
  req: Request,
  tenantId: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_contract_details_with_shipments';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Contract Details with Shipments via RabbitMQ for tenant ${tenantId}`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Contract Details. Falling back to CRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetContractDetailsWithShipmentsFromCRMDB(tenantId);
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
              `✅ [QMS Consumer] Received ${response.length} Contract Detail records via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Contract Detail response:',
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

    const requestPayload: RabbitMQCRMRequestPayload = {
      tenant_id: tenantId,
      start_date: undefined, // Contract details tidak perlu filter tanggal
      end_date: undefined,
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
// NEW FUNCTIONS FOR CONTRACT ASSESSMENT
// ================================

/**
 * Get contract by pkid via RabbitMQ with fallback to database
 */
export const getCRMContractByPkidViaRPC = async (
  req: Request,
  contract_pkid: number,
): Promise<CRMContractData | null> => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_crm_contract_by_pkid';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting CRM contract detail via RabbitMQ for contract ${contract_pkid}`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for CRM contract detail. Falling back to CRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetContractByPkidFromCRMDB(contract_pkid);
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
              `✅ [QMS Consumer] Received CRM contract detail via RabbitMQ: ${response?.code || 'null'}`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing CRM contract detail response:',
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

    const requestPayload: RabbitMQCRMRequestPayload = {
      contract_pkid,
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

/**
 * Get all CRM contracts via RabbitMQ with fallback to database
 */
export const getAllCRMContractsViaRPC = async (
  req: Request,
): Promise<CRMContractData[]> => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_all_crm_contracts';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(`📡 [QMS Consumer] Requesting all CRM contracts via RabbitMQ`);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for all CRM contracts. Falling back to CRM Database...',
      );
      try {
        const fallbackData = await fallbackGetAllContractsFromCRMDB();
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
              `✅ [QMS Consumer] Received ${response?.length || 0} CRM contracts via RabbitMQ`,
            );
            resolve(response || []);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing all CRM contracts response:',
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

    const requestPayload: RabbitMQCRMRequestPayload = {
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

/**
 * Get CRM contracts by industry_id via RabbitMQ with fallback to database
 */
export const getCRMContractsByIndustryIdViaRPC = async (
  req: Request,
  industry_id: number,
): Promise<CRMContractData[]> => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_crm_contracts_by_industry_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting CRM industry contracts via RabbitMQ for industry ${industry_id}`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for CRM industry contracts. Falling back to CRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetContractsByIndustryFromCRMDB(industry_id);
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
              `✅ [QMS Consumer] Received ${response?.length || 0} CRM industry contracts via RabbitMQ`,
            );
            resolve(response || []);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing CRM industry contracts response:',
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

    const requestPayload: RabbitMQCRMRequestPayload = {
      industry_id,
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

/**
 * Get CRM contracts by retail_id via RabbitMQ with fallback to database
 */
export const getCRMContractsByRetailIdViaRPC = async (
  req: Request,
  retail_id: number,
): Promise<CRMContractData[]> => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_crm_contracts_by_retail_id';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting CRM retail contracts via RabbitMQ for retail ${retail_id}`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for CRM retail contracts. Falling back to CRM Database...',
      );
      try {
        const fallbackData =
          await fallbackGetContractsByRetailFromCRMDB(retail_id);
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
              `✅ [QMS Consumer] Received ${response?.length || 0} CRM retail contracts via RabbitMQ`,
            );
            resolve(response || []);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing CRM retail contracts response:',
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

    const requestPayload: RabbitMQCRMRequestPayload = {
      retail_id,
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

/**
 * Get CRM contracts with user resolution via RabbitMQ with fallback to database
 * This is a high-level function that combines multiple RPC calls for assessment
 */
export const getCRMContractsWithUserResolutionViaRPC = async (
  req: Request,
  tenant_id: number,
  user_type: 'industry' | 'retail',
): Promise<CRMContractData[]> => {
  try {
    console.log(
      `🔍 [QMS Consumer] Getting CRM contracts with user resolution for tenant ${tenant_id} (${user_type})`,
    );

    if (user_type === 'industry') {
      // For industry: get contracts by industry_pkid
      const contracts = await getCRMContractsByIndustryIdViaRPC(req, tenant_id);
      console.log(
        `✅ [QMS Consumer] Retrieved ${contracts.length} CRM industry contracts`,
      );
      return contracts || [];
    } else if (user_type === 'retail') {
      // For retail: get contracts by retail_pkid
      const contracts = await getCRMContractsByRetailIdViaRPC(req, tenant_id);
      console.log(
        `✅ [QMS Consumer] Retrieved ${contracts.length} CRM retail contracts`,
      );
      return contracts || [];
    }

    console.log(`⚠️ [QMS Consumer] Unknown user_type: ${user_type}`);
    return [];
  } catch (error) {
    console.error(
      `❌ [QMS Consumer] Error in CRM combined user resolution:`,
      error,
    );

    // Final fallback: use database fallback
    try {
      const { fallbackGetCRMContractsWithUserResolution } = await import(
        '../business-layer/services/fallbackCRM.service'
      );
      const fallbackContracts = await fallbackGetCRMContractsWithUserResolution(
        tenant_id,
        user_type,
      );

      console.log(
        `🔄 [QMS Consumer] Final CRM fallback successful, got ${fallbackContracts.length} contracts`,
      );
      return fallbackContracts || [];
    } catch (finalError) {
      console.error(
        `❌ [QMS Consumer] All CRM fallback methods failed:`,
        finalError,
      );
      return []; // Return empty array instead of throwing
    }
  }
};
