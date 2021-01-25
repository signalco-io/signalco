import { Button, Grid, Typography } from "@material-ui/core";
import Link from "next/link";

const Onboarding = () => {
  return (
    <>
      <Typography variant="h1">Welcome</Typography>
    </>
  );
};

const Index = () => (
  <Grid container direction="column">
    <Grid item>
      <Link href="/app" passHref>
        <Button>Login</Button>
      </Link>
    </Grid>
    <Grid item>
      <Onboarding />
    </Grid>
  </Grid>
  
  // const router = useRouter();

  // if (isAuthenticated)
  //   router.push("/dashboard");

  // useEffect(() => {
  //   if (isAuthenticated)
  //     router.push("/dashboard");
  // }, [isAuthenticated]);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>{error.message}</div>;
  // if (!isAuthenticated) return <Login />;
  // return <div>Redirecting...</div>;
);

export default Index;