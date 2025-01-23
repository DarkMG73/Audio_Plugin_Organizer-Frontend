import axios from 'axios';
import ipcExchange from '../clientController';

axios.defaults.withCredentials = true;

// HELPER FUNCTIONS
const handleError = (error, functionName) => {
  const defaultMessage = `There was an error. Advise the website admin the following error occurred:\\n\\nEA-U-${functionName}`;
  if (Object.hasOwn(error, 'data')) {
    if (
      Object.hasOwn(error.data, 'message') &&
      error.data.message.constructor === String
    )
      return error.message + '\\n\\nFunction name: ' + functionName;
    return defaultMessage;
  }

  if (!Object.hasOwn(error, 'data')) {
    if (Object.hasOwn(error, 'message') && error.message.constructor === String)
      return error.message + '\\n\\nFunction name: ' + functionName;
    return defaultMessage;
  }

  return defaultMessage;
};

/// GET LOCAL APP VERSION /////////////////////////////
export const getLocalAppVersion = async () => {
  try {
    const res = await ipcExchange('appVersion:find-local', {});

    return res;
  } catch (error) {
    return handleError(error, 'getLocalPluginData');
  }
};

/// GET THE APP VERSIONS /////////////////////////////
export const getAppVersions = async () => {
  let axiosConfig = null;

  axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
    maxBodyLength: Infinity,
    timeout: 60000,
  };
  try {
    const res = await axios.get('/api/app-versions/get', axiosConfig);

    const localData = await getLocalAppVersion();

    const outputObj = { ...res.data[0], localData };
    return outputObj;
  } catch (e) {
    console.log('ERROR --->', e);
    // return handleError(e);
  }
};

/// UPDATE APP VERSIONS //////////////////////////////////
export async function updateAppVersions(dataObj, user) {
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + user.token,
    },
  };

  const response = await axios
    .post(`/api/app-versions/update/`, { dataObj }, axiosConfig)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log('err', err);
      // console.log("errors", err.response.data.err.message);
      return err;
    });
  return response;
}
