import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const checkContacts = async () => {
  const storedToken = localStorage.getItem("token");
  const response = await apiClient.get(
    `/fetch_contacts.php?mode=check_contact&access_token=${storedToken}`
  );

  if (Array.isArray(response.data.result.results)) {
    response.data.result = transformData(response.data.result.results);
  }
  return { response };
};
const fetchContacts = async (data) => {
  console.log("FETCH CONT")

  const storedToken = localStorage.getItem("token");
  const rawValueString = encodeURIComponent(JSON.stringify(data.date_filter.raw_value));
  const url = `/fetch_contacts.php?mode=all_contact&access_token=${storedToken}&selected_filter=${data.date_filter.selected_filter}&raw_value=${rawValueString}`;
  console.log(url)
  const response = await apiClient.get(url);
  if (Array.isArray(response.data.result.results)) {
    response.data.result.results = transformData(response.data.result.results);
  }
  return { response };
};

const transformData = (rawDataArray) => {
  return rawDataArray.map((rawData) => ({
    email: rawData.properties.email,
    firstName: rawData.properties.firstname,
    lastName: rawData.properties.lastname,
    customerDate: new Date(rawData.properties.createdate)
      .toISOString()
      .split("T")[0], // Format date to YYYY-MM-DD
    leadDate: new Date(rawData.properties.lastmodifieddate)
      .toISOString()
      .split("T")[0], // Format date to YYYY-MM-DD
  }));
};
const AccessToken = async () => {
  try {
    const response = await apiClient.get("/oauth.php", {
      headers: {
        // Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const initiateOAuth = () => {
  const clientID = "5170996c-2acb-42b4-b36e-aa294ccb52d9";
  const redirectUri = encodeURIComponent(`${baseURL}/oauth.php`);
  const scope = encodeURIComponent(
    "crm.objects.companies.read crm.objects.companies.write crm.objects.contacts.read crm.objects.contacts.write"
  );
  const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  window.location.href = authUrl;
};

const exchangeCodeForToken = async (code) => {
  try {
    const response = await apiClient.get("/oauth.php", {
      params: { code },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  AccessToken,
  fetchContacts,
  initiateOAuth,
  exchangeCodeForToken,
  checkContacts,
};
