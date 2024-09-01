import { UserRoleType } from "../../../../domain/user/User";
import { IBaseRepository } from "../../../../domain/shared/IBaseRepository";
import { Permission } from "../../Permission";

export interface IPermissionRepository extends IBaseRepository<Permission> {
  findByRole: (role: UserRoleType) => Promise<Permission | null>;
}
