interface UserInfo {
  name: string;
  isCreator: string;
  isAdmin: string;
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
    data:
      | {
          message: string;
        }
      | undefined;
  };
};
