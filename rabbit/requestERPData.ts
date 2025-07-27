import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import {
  fallbackGetReceivesFromERPInventoryDB,
  fallbackGetTransfersFromERPInventoryDB,
  fallbackGetProductionRequestsFromERPManufacturingDB,
  fallbackGetInspectionProductsFromERPManufacturingDB,
} from '../business-layer/services/fallbackERP.service';

export const getReceivesViaRPC = async (req: Request, tenant_id: number) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_receives';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Receives data via RabbitMQ for tenant ${tenant_id}`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Receives. Falling back to ERP Inventory Database...',
      );
      try {
        const fallbackData =
          await fallbackGetReceivesFromERPInventoryDB(tenant_id);
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
              `✅ [QMS Consumer] Received ${response.length} Receives records via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Receives response:',
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
      tenant_id: tenant_id,
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

export const getTransfersViaRPC = async (req: Request, tenant_id: number) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_transfers';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Transfers data via RabbitMQ for tenant ${tenant_id}`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Transfers. Falling back to ERP Inventory Database...',
      );
      try {
        const fallbackData =
          await fallbackGetTransfersFromERPInventoryDB(tenant_id);
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
              `✅ [QMS Consumer] Received ${response.length} Transfers records via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Transfers response:',
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
      tenant_id: tenant_id,
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

export const getProductionRequestsViaRPC = async (
  req: Request,
  tenant_id: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_production_requests';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Production Requests data via RabbitMQ for tenant ${tenant_id}`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Production Requests. Falling back to ERP Manufacturing Database...',
      );
      try {
        const fallbackData =
          await fallbackGetProductionRequestsFromERPManufacturingDB(tenant_id);
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
              `✅ [QMS Consumer] Received ${response.length} Production Requests records via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Production Requests response:',
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
      tenant_id: tenant_id,
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

export const getInspectionProductsViaRPC = async (
  req: Request,
  tenant_id: number,
) => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  const channel = await connection.createChannel();

  const queue = 'rpc_get_inspection_products';
  const correlationId = uuidv4();
  const tempQueue = await channel.assertQueue('', { exclusive: true });

  console.log(
    `📡 [QMS Consumer] Requesting Inspection Products data via RabbitMQ for tenant ${tenant_id}`,
  );

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(async () => {
      console.warn(
        '⚠️ [QMS Consumer] RabbitMQ timeout for Inspection Products. Falling back to ERP Manufacturing Database...',
      );
      try {
        const fallbackData =
          await fallbackGetInspectionProductsFromERPManufacturingDB(tenant_id);
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
              `✅ [QMS Consumer] Received ${response.length} Inspection Products records via RabbitMQ`,
            );
            resolve(response);
          } catch (parseErr) {
            console.error(
              '❌ [QMS Consumer] Error parsing Inspection Products response:',
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
      tenant_id: tenant_id,
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
