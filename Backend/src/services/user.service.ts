import { UserRole } from "@prisma/client";

const findUserByIdAndRole = async (id: string, role: UserRole) => {
  const userData = await prisma?.user.findFirst({
    where: {
      id,
      role,
    },
  });
  return userData;
};

export {findUserByIdAndRole}
