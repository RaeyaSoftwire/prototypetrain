import oneABReview from '../data/userCaseScreens/1ab-review.png';
import oneABConfirmation from '../data/userCaseScreens/1ab-confirmation.png';
import oneCReview from '../data/userCaseScreens/1c-review.png';
import oneCConfirmation from '../data/userCaseScreens/1c-confirmation.png';
import oneEReview from '../data/userCaseScreens/1e-review.png';
import oneEConfirmation from '../data/userCaseScreens/1e-confirmation.png';
import twoAReview from '../data/userCaseScreens/2a-review.png';
import twoAConfirmation from '../data/userCaseScreens/2a-confirmation.png';
import twoBReview from '../data/userCaseScreens/2b-review.png';
import twoBConfirmation from '../data/userCaseScreens/2b-confirmation.png';
import twoBTwoReview from '../data/userCaseScreens/2b2-review.png';
import twoBTwoConfirmation from '../data/userCaseScreens/2b2-confirmation.png';
import threeABReview from '../data/userCaseScreens/3ab-review.png';
import threeABConfirmation from '../data/userCaseScreens/3ab-confirmation.png';

const userCases = [
  {
    id: '1A/B',
    name: 'Business user going to a conference / PA/Admin - group booking',
    review: oneABReview,
    confirmation: oneABConfirmation,
  },
  {
    id: '1C',
    name: 'User has family emergency',
    review: oneCReview,
    confirmation: oneCConfirmation,
  },
  {
    id: '1E',
    name: 'Student visits family during break',
    review: oneEReview,
    confirmation: oneEConfirmation,
  },
  {
    id: '2A',
    name: 'Business user - meeting',
    review: twoAReview,
    confirmation: twoAConfirmation,
  },
  {
    id: '2B',
    name: 'Student goes to a \'festival`\'',
    review: twoBReview,
    confirmation: twoBConfirmation,
  },
  {
    id: '2B.2',
    name: 'User goes for a city break',
    review: twoBTwoReview,
    confirmation: twoBTwoConfirmation,
  },
  {
    id: '3A/B',
    name: 'PA/Admin users - mix booking / Business user - meeting',
    review: threeABReview,
    confirmation: threeABConfirmation,
  },
]

export default userCases;