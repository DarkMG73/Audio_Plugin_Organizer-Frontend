import axios from 'axios';

export const getAdminNotes = async () => {
  let axiosConfig = null;

  axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
    maxBodyLength: Infinity,
    timeout: 60000,
  };

  try {
    const res = await axios.get('/api/special-admin/notes', axiosConfig);

    if (
      Object.hasOwn(res, 'data') &&
      Array.isArray(res.data) &&
      Object.hasOwn(res.data[0], 'notes')
    ) {
      return res.data[0].notes;
    } else {
      return 'nope';
    }
  } catch (e) {
    console.log('ERROR --->', e);
    // return handleError(e);
  }
};

export async function updateAdminNotes(user, dataObj) {
  if (!user || !dataObj)
    return { message: 'Error: Incorrect data', status: 500 };
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + user.token,
    },
  };

  const output = await axios
    .post(`/api/special-admin/notes/`, { dataObj }, axiosConfig)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(
        '%c --> %cline:12%cerr',
        'color:#fff;background:#ee6f57;padding:3px;border-radius:2px',
        'color:#fff;background:#1f3c88;padding:3px;border-radius:2px',
        'color:#fff;background:rgb(130, 57, 53);padding:3px;border-radius:2px',
        err,
      );
      const error = err.response;
      console.log(
        '%c --> %cline:14%cerror',
        'color:#fff;background:#ee6f57;padding:3px;border-radius:2px',
        'color:#fff;background:#1f3c88;padding:3px;border-radius:2px',
        'color:#fff;background:rgb(130, 57, 53);padding:3px;border-radius:2px',
        error,
      );
      if (
        Object.hasOwn(error, 'data') &&
        Object.hasOwn(error.data, 'message')
      ) {
        console.log(
          '%c --> %cline:30%cerror.data.hasOwnProperty(message)',
          'color:#fff;background:#ee6f57;padding:3px;border-radius:2px',
          'color:#fff;background:#1f3c88;padding:3px;border-radius:2px',
          'color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px',
          Object.hasOwn(error.data, 'message'),
        );

        if (error.data.message.constructor === String) return error;

        if (Object.hasOwn(error.data.message, 'code')) {
          console.log(
            '%c --> %cline:41%cerror.data.message.hasOwnProperty(code)',
            'color:#fff;background:#ee6f57;padding:3px;border-radius:2px',
            'color:#fff;background:#1f3c88;padding:3px;border-radius:2px',
            'color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px',
            Object.hasOwn(error.data.message, 'code'),
          );
          // MongoDB error 11000 is a duplicate error
          if (error.data.message.code === 11000) {
            console.log(
              '%c --> %cline:51%c(error.data.message.code === 11000',
              'color:#fff;background:#ee6f57;padding:3px;border-radius:2px',
              'color:#fff;background:#1f3c88;padding:3px;border-radius:2px',
              'color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px',
              error.data.message.code === 11000,
            );
            const errorMessage = {
              status: 400,
              message: `${error.data.message.keyValue.email} is already being used in the database. Please use a different email address or login with this email address and the password originally set.`,
            };
            return errorMessage;
          }
          return error.message.code;
        }
      }

      console.log('error', error);
      if (Object.hasOwn(error, 'data') && Object.hasOwn(error.data, 'message'))
        console.log('errors', error.data.message);
    });

  return output;
}
