import { User, UserRole } from "./types";

export default function canUserEdit(user: User | undefined, entity: { ownerId: number }) {
  return user && (user?.id === entity.ownerId || user?.role !== UserRole.regular);
}
