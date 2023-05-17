import { useQuery } from "react-query";
import { axios } from "../../lib/axios";
import { PaginatedData, User } from "../../lib/types";
import Layout from "../../components/Layout";
import CookieManager from "../../lib/cookie-manager";
import useRouteQuery from "../../lib/hooks/useRouteQuery";
import Pagination from "../../components/Pagination";
import { useEffect } from "react";
import { Field, Formik, FormikProps } from "formik";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function AdminPage() {
  const [query] = useRouteQuery();
  const take = parseInt(query.take ?? CookieManager.get("paginationSize") ?? "15");
  const skip = parseInt(query.skip ?? "0");

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery<PaginatedData<User>>(["user"], () => axios.get(`/user?take=${take}&skip=${skip}`).then(r => r.data));

  useEffect(() => {
    refetch();
  }, [take, skip]);

  const handlePaginationPreferenceChange = async (id: number, paginationPreference: number | null) => {
    await axios.patch(`/user/${id}`, { paginationPreference });
    await refetch();
  };

  const handleWriteAllData = async () => {
    await axios.post("/admin/write-all");
  };

  const handleDeleteAllData = async () => {
    await axios.get("/admin/delete-all");
  };

  return (
    <Layout>
      <h1 className="text-4xl mb-3">All users</h1>
      {users?.data && <Pagination total={users!.total} />}
      <table>
        <thead>
          <th>Id</th>
          <th>Username</th>
          <th>Email</th>
          <th>Pagination Preference</th>
        </thead>
        <tbody>
          {users?.data.map(user => (
            <tr className="py-1">
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email ?? <span className="italic">none</span>}</td>
              <td>
                <Formik
                  initialValues={{
                    paginationPreference: user.paginationPreference?.toString(),
                  }}
                  onSubmit={({ paginationPreference }) =>
                    handlePaginationPreferenceChange(
                      user.id,
                      paginationPreference ? parseInt(paginationPreference) : null
                    )
                  }
                >
                  {(props: FormikProps<any>) => (
                    <Field as={Input} name="paginationPreference" type="text" onBlur={props.submitForm} />
                  )}
                </Formik>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button onClick={handleDeleteAllData} className="bg-red-400">
        Delete all data
      </Button>
      <Button onClick={handleWriteAllData} className="bg-green-400">
        Write all data
      </Button>
    </Layout>
  );
}
