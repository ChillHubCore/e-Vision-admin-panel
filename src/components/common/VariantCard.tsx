import React from 'react';
import { Badge, Card, Image, Stack, Text } from '@mantine/core';
import { ProductVariantProps } from '../Dashboard/types';

export default function VariantCard({ VariantData }: { VariantData: ProductVariantProps }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={VariantData.images[0]} height={160} alt="Norway" />
      </Card.Section>

      <Stack justify="space-between" mt="md" mb="xs">
        {VariantData.availability ? (
          <Badge my="md" color="green">
            Available
          </Badge>
        ) : (
          <Badge my="md" color="red">
            Unavailable
          </Badge>
        )}
      </Stack>

      <Stack>
        <Text size="sm" c="dimmed">
          <b>SKU</b> : {VariantData.SKU}
        </Text>

        <Text size="sm" c="dimmed">
          Price : {VariantData.price.regularPrice.toLocaleString()}
        </Text>
      </Stack>
    </Card>
  );
}
