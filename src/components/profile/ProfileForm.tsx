"use client";
import { updateProfile } from "@/actions/user/update-profile";
import { User } from "@prisma/client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  user: User | null | undefined;
}
export const ProfileForm = ({ user }: Props) => {
  const { handleSubmit, register } = useForm<User>({
    defaultValues: {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
    },
  });

  const [preview, setPreview] = useState<string | null>(user?.image ?? null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: User) => {
    const formData = new FormData();
    formData.append("id", data.id ?? "");
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("role", data.role);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const { message, ok } = await updateProfile(formData);
    if (!ok) {
      toast.error(message);
      return;
    }
    toast.success(message);
  };

  return (
    <div className="grid px-5 mb-16 grid-cols-1 md:grid-cols-1 gap-3 lg:grid-cols-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full">
          <div className="flex flex-col mb-2">
            <span>Nombre</span>
            <input
              type="text"
              className="p-2 border rounded-md bg-gray-200"
              {...register("name", { required: true })}
            />
          </div>
          <div className="flex flex-col mb-2">
            <span>Email</span>
            <input
              type="text"
              className="p-2 border rounded-md bg-gray-200"
              {...register("email", { required: true })}
            />
          </div>
          <div className="flex flex-col mb-2">
            <span>Role</span>
            <input
              disabled
              type="text"
              className="p-2 border rounded-md bg-gray-200 disabled:text-gray-400"
              {...register("role", { required: true })}
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>Imagen</span>
            <div className="justify-center md:justify-normal items-center flex">
              {preview ? (
                <Image
                  src={preview}
                  alt="user image"
                  className="rounded-lg border border-gray-100 transition-all"
                  width={200}
                  height={200}
                />
              ) : (
                <p className="text-center text-sm">No hay imagen</p>
              )}
            </div>
            <div className="flex flex-col mb-2">
              <span>Foto</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="p-2 border rounded-md bg-gray-200"
                accept="image/png, image/jpeg, image/avif"
              />
            </div>
          </div>
          <button className="w-full btn-primary">Guardar cambios</button>
        </div>
      </form>
    </div>
  );
};
