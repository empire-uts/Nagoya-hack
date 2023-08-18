"use client"

import * as PushAPI from '@pushprotocol/restapi';
import { Wallet, ethers } from "ethers";

// const PUSH_CHANNEL_ADDRESS = process.env.PUSH_CHANNEL_ADDRESS
const PUSH_CHANNEL_ADDRESS = "0xc9d7144d4Bb4fF5936D1540faaeeFd0201b5fdf8"

const getConnectSigner = ():any => {
  return new Wallet(process.env.PRIVATE_KEY!);
};

export const sendNotifications = async(address: string, adminAddress: string, excelNameHash: string) => {
  const env: any = 'staging';
  // get signer
  const signer = getConnectSigner();
  // send notifications
  const apiResponse = await PushAPI.payloads.sendNotification({
    signer: signer,
    type: 3, // target
    identityType: 2, // direct payload
    notification: {
      title: `【document checker】Received Notification`,
      body: `You were received ***!!`
    },
    payload: {
      title: `【document checker】Received Notification`,
      body: `${adminAddress}:${excelNameHash}}`,
      cta: '',
      img: ''
    },
    recipients: `eip155:5:${address}`, // recipient address
    channel: `eip155:5:${PUSH_CHANNEL_ADDRESS}`, // channel address
    env: env,
  });

  console.log("send notification result:", apiResponse);
};

export const loadNotifications = async(
  account: string
): Promise<PushAPI.ParsedResponseType[]> => {
  
  const env: any = 'staging';
  console.log("account:", account)
  // get spams
  const spams: PushAPI.ParsedResponseType[] = await PushAPI.user.getFeeds({
    user: `eip155:5:${account}`,
    // spam: true,
    env: env
  });

  return spams;
};