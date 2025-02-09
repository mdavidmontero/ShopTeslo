"use server";

import prisma from "@/lib/prisma";
import { $Enums } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

const updateProfileSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string().min(3).max(255),
  email: z.string().email(),
  role: z.nativeEnum($Enums.Role),
  image: z.any().optional(), // Permitir `File` o `string`
});

export const updateProfile = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const userParsed = updateProfileSchema.safeParse(data);

  if (!userParsed.success) {
    return {
      ok: false,
      message: "Datos inválidos",
    };
  }

  const user = userParsed.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id! },
      select: { image: true }, // Obtener la imagen actual
    });

    let newImage = existingUser!.image;

    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadImageProfile(
        imageFile,
        existingUser!.image!
      );
      if (uploadResult) {
        newImage = uploadResult.url;
      }
    }
    const updatedUser = await prisma.user.update({
      where: { id: user.id! },
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
        image: newImage,
      },
    });

    revalidatePath("/profile");

    return {
      ok: true,
      user: updatedUser,
      message: "Datos actualizados correctamente",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Ocurrió un error al actualizar los datos",
    };
  }
};

const uploadImageProfile = async (image: File, oldImageUrl?: string) => {
  try {
    if (oldImageUrl) {
      const publicId = oldImageUrl.split("/").pop()?.split(".")[0] ?? "";

      if (publicId) {
        const deleteimage = await cloudinary.uploader.destroy(publicId);
        console.log(deleteimage);
      }
    }

    const buffer = await image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`
    );

    return {
      url: uploadResponse.secure_url,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
