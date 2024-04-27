import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { Alert, Container } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import PaginationComponent from "../components/PaginationComponent";

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerSideProps = {
  statusCode: number;
  users: TUserItem[];
  total: number;
};

export const getServerSideProps: GetServerSideProps<TGetServerSideProps> = async (
  ctx: GetServerSidePropsContext<ParsedUrlQuery>
) => {
  try {
    const { query } = ctx;
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const limit = 20;

    const res = await fetch(`http://localhost:3000/users?page=${page}&limit=${limit}`, { method: "GET" });
    if (!res.ok) {
      return { props: { statusCode: res.status, users: [], total: 0 } };
    }

    const data = await res.json();
    const { users, total } = data;

    return {
      props: { statusCode: 200, users, total },
    };
  } catch (e) {
    return { props: { statusCode: 500, users: [], total: 0 } };
  }
};

export default function Home({ statusCode, users, total }: TGetServerSideProps) {
  const router = useRouter();
  const entriesInTable = 20;
  const currentPage = router.query.page ? parseInt(router.query.page as string, 10) : 1;
  const totalPages = Math.ceil(total / entriesInTable);

  if (statusCode !== 200) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`);
  };

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={"mb-5"}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </Container>
      </main>
    </>
  );
}
