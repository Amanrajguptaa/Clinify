import { UserRole } from "@prisma/client";

export const findUserByIdAndRole = async (id: string, role: UserRole) => {
  const userData = await prisma?.user.findFirst({
    where: {
      id,
      role,
    },
  });
  return userData;
};
