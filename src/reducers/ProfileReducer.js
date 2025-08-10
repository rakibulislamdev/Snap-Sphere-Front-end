// import { actions } from "../actions";

// const initialState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// function ProfileReducer(state, action) {
//   switch (action.type) {
//     case actions.profile.DATA_FETCHING: {
//       return {
//         ...state,
//         loading: true,
//       };
//     }

//     case actions.profile.DATA_FETCHED: {
//       return {
//         ...state,
//         loading: false,
//         user: action.data.user,
//         posts: action.data.posts,
//       };
//     }

//     case actions.profile.DATA_FETCH_ERROR: {
//       return {
//         ...state,
//         loading: false,
//         error: action.error,
//       };
//     }

//     case actions.profile.IMAGE_UPDATED: {
//       return {
//         ...state,
//         user: {
//           ...state.user,
//           avatar: action.data.avatar,
//         },
//       };
//     }

//     case actions.profile.USER_DATA_EDITED: {
//       return {
//         ...state,
//         user: {
//           ...state.user,
//           name: action.data.name,
//           bio: action.data.bio,
//           website: action.data.website,
//           gender: action.data.gender,
//         },
//       };
//     }

//     case actions.profile.PASSWORD_CHANGED: {
//       return {
//         ...state,
//         loading: false,
//       };
//     }

//     default: {
//       return state;
//     }
//   }
// }

// export { ProfileReducer, initialState };
