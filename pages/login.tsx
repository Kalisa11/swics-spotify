import React from "react";
import { getProviders, signIn, } from "next-auth/react";

type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
};

type Providers = {
  spotify: Provider;
};

const Login = ({ providers }: { providers: Providers }) => {
  console.log(providers);
  return (
    <div className="flex flex-col items-center bg-black min-h-screen justify-center">
      <img
        src="https://links.papareact.com/9xl"
        alt="spotify-logo"
        className="w-52 mb-5"
      />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-lg"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Login;

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
