interface UserInfo {
  name: string;
  isCreator: boolean;
  isAdmin: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
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
