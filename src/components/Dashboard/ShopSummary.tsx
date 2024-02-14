import { Grid, Text } from '@mantine/core';
import classes from '@/lib/styles/Dashboard.module.scss';

export default function ShopSummary() {
  return (
    <Grid className={classes.gridContainer}>
      <Grid.Col className={classes.gridItem} p="lg" mb="md" span={{ base: 12, md: 6, lg: 3 }}>
        <Text size="lg">Total Users</Text>
        <Text size="xl">100</Text>
      </Grid.Col>

      <Grid.Col className={classes.gridItem} p="lg" mb="md" span={{ base: 12, md: 6, lg: 3 }}>
        <Text size="lg">Total Products</Text>
        <Text size="xl">50</Text>
      </Grid.Col>

      <Grid.Col className={classes.gridItem} p="lg" mb="md" span={{ base: 12, md: 6, lg: 3 }}>
        <Text size="lg">Total Orders</Text>
        <Text size="xl">20</Text>
      </Grid.Col>

      <Grid.Col className={classes.gridItem} p="lg" mb="md" span={{ base: 12, md: 6, lg: 3 }}>
        <Text size="lg">Total Reviews</Text>
        <Text size="xl">30</Text>
      </Grid.Col>

      <Grid.Col className={classes.gridItem} p="lg" mb="md" span={{ base: 12, md: 6, lg: 3 }}>
        <Text size="lg">Top Rated Products</Text>
        <Text size="xl">5</Text>
      </Grid.Col>

      <Grid.Col className={classes.gridItem} p="lg" mb="md" span={{ base: 12, md: 6, lg: 3 }}>
        <Text size="lg">Total Tickets Opened</Text>
        <Text size="xl">10</Text>
      </Grid.Col>
    </Grid>
  );
}
