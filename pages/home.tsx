import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  Box,
  Grid,
} from "@material-ui/core";
import AppLayout from "../components/AppLayout";
import StorageList from "../components/management/storage/StorageList";

const Home = () => {
  return (
    <Grid container>
      <Grid item xs={3}>
        <Card>
          <CardHeader title="Storage Tables" />
          <CardContent>
            <StorageList />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

Home.layout = AppLayout;

export default Home;
