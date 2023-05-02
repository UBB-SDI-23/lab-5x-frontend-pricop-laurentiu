import classNames from "classnames";
import { User } from "../../lib/types";
import { Link } from "react-router-dom";

export default function UserBadge({ user, className }: { user: User; className?: string }) {
  return (
    <div className={classNames("text-sm", className)}>
      <i className="bi-person mr-2"></i>
      <Link to={`/profile/${user.id}`}>{user.username}</Link>
    </div>
  );
}
