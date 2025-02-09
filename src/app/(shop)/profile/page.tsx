import { getUserProfile } from "@/actions/user/get-user";
import { auth } from "@/auth.config";
import { ProfileForm, Title } from "@/components";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = await getUserProfile();

  return (
    <div>
      <Title title="Perfil" />
      <ProfileForm user={user?.user} />
    </div>
  );
}
