interface UserInfo {
  username: string;
  isCreator: boolean;
  isAdmin: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: {
    label: string;
    value: number;
  };
  token: string;
}

interface UserProps {
  _id: string;
  name: string;
  email: boolean;
  phone: boolean;
}

interface UserState {
  userInfo: UserInfo | null;
}

type CustomError = {
  message: string;
  response?: {
    data: {
      message: string;
    };
  };
};

interface shippingAddressProps {
  reciverName: string;
  reciverPhone: string;
  address: string;
  country: string;
  province: string;
  city: string;
  postalCode: string;
  shippingMethod: string;
}

interface ShoppingCartType {
  shoppingCart: {
    cartItems: ShoppingCartPayloadProps[];
    paymentMethod: string;
    shippingAddress: shippingAddressProps;
  };
}

interface ShoppingCartPayloadProps {
  variant: ProductVariantProps;
  product: ProductEntityProps;
  quantity: number;
}
