import { mkdir, readFile, rename, writeFile } from 'fs/promises';
import path from 'path';

export interface LocalOrder {
  id: string;
  customer: string;
  email: string;
  address: string;
  postcode: string;
  phone: string;
  total: number;
  items: number;
  status: string;
  paymentMethod: string;
  date: string;
  deliveryDate?: string;
  sofaDetails?: string;
  emailSentAt?: string;
  lines: Array<{ title: string; color: string; quantity: number; price: number; type?: 'sofa' | 'swatch' }>;
}

const dataDirectory = path.join(process.cwd(), '.local-data');
const ordersFile = path.join(dataDirectory, 'orders.json');

async function readOrders(): Promise<LocalOrder[]> {
  try {
    return JSON.parse(await readFile(ordersFile, 'utf8')) as LocalOrder[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    return [];
  }
}

async function saveOrders(orders: LocalOrder[]) {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryFile = `${ordersFile}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(orders, null, 2), 'utf8');
  await rename(temporaryFile, ordersFile);
}

export const getLocalOrders = readOrders;

export async function createLocalOrder(input: Omit<LocalOrder, 'id' | 'date'>) {
  const orders = await readOrders();
  const order: LocalOrder = {
    ...input,
    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
    date: new Date().toISOString(),
  };
  await saveOrders([order, ...orders]);
  return order;
}

export async function updateLocalOrderStatus(id: string, status: string) {
  const orders = await readOrders();
  const order = orders.find((candidate) => candidate.id === id);
  if (!order) return undefined;
  order.status = status;
  await saveOrders(orders);
  return order;
}

export async function updateLocalOrderDelivery(id: string, deliveryDate: string, sofaDetails: string) {
  const orders = await readOrders();
  const order = orders.find((candidate) => candidate.id === id);
  if (!order) return undefined;
  order.deliveryDate = deliveryDate;
  order.sofaDetails = sofaDetails;
  await saveOrders(orders);
  return order;
}

export async function markLocalOrderEmailSent(id: string) {
  const orders = await readOrders();
  const order = orders.find((candidate) => candidate.id === id);
  if (!order) return undefined;
  order.emailSentAt = new Date().toISOString();
  await saveOrders(orders);
  return order;
}
