const coachFirebaseURL =
  'https://vue-http-demo-841ad-default-rtdb.firebaseio.com';

export default {
  async contactCoach(context, payload) {
    const nweRequest = {
      userEmail: payload.email,
      message: payload.message
    };

    const response = await fetch(
      `${coachFirebaseURL}/requests/${payload.coachId}.json`,
      {
        method: 'POST',
        body: JSON.stringify(nweRequest)
      }
    );
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to send');
      throw error;
    }

    nweRequest.id = responseData.name;
    nweRequest.coachId = payload.coachId;
    context.commit('addRequest', nweRequest);
  },
  async fetchRequests(context) {
    const coachId = context.rootGetters.userId;
    const response = await fetch(
      `${coachFirebaseURL}/requests/${coachId}.json`
    );
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to fetch requests.'
      );
      throw error;
    }

    const requests = [];

    for (const key in responseData) {
      const request = {
        id: key,
        coachId,
        userEmail: responseData[key].userEmail,
        message: responseData[key].message
      };
      requests.push(request);
    }

    context.commit('setRequests', requests);
  }
};
