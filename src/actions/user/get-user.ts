"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getUserProfile = async () => {
  try {
    const session = await auth();
    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    return {
      ok: true,
      user: user,
    };
  } catch (error) {
    console.log(error);
  }
};
