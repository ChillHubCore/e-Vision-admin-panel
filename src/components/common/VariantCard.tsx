import { Badge, Button, Card, Image, Stack, Text } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { ProductEntityProps, ProductVariantProps } from '../Dashboard/types';
import { addToCart } from '@/lib/redux/ShoppingCart/ShoppingCart';

export default function VariantCard({
  ProductData,
  VariantData,
  addFlag,
}: {
  ProductData: ProductEntityProps;
  VariantData: ProductVariantProps;
  addFlag?: boolean;
}) {
  const dispatch = useDispatch();
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
      {addFlag && (
        <Button
          onClick={() => {
            if (VariantData.inStock && VariantData.availability) {
              dispatch(addToCart({ product: ProductData, variant: VariantData, quantity: 1 }));
            }
          }}
          my="md"
          disabled={!VariantData.inStock || !VariantData.availability}
        >
          {!VariantData.inStock || !VariantData.availability ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      )}
    </Card>
  );
}
