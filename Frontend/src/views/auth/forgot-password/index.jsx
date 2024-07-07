import React, { useState } from "react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/login-image-half-eef3f2.jpg";
import EmailVerify from "views/auth/forgot-password/components/emailVerification";
import ResetPassword from "views/auth/forgot-password/components/resetPassword";

function ForgotPassword() {
  const [stepOnePassed, setStepOnePassed] = useState(false);
  const [username, setUsername] = useState("");
  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      {stepOnePassed ? (
        <ResetPassword username={username} />
      ) : (
        <EmailVerify
          setStepOnePassed={setStepOnePassed}
          username={username}
          setUsername={setUsername}
        />
      )}
    </DefaultAuth>
  );
}

export default ForgotPassword;
