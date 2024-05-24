import Events from './events';
import Sessions from './sessions';
import Users from './users';
import Tracks from './tracks';
import Schedule from './schedule';
import Locations from './locations';
import Wishes from './wishes';

const Api = {
  ...Events,
  ...Sessions,
  ...Users,
  ...Tracks,
  ...Schedule,
  ...Locations,
  ...Wishes,
};

export default Api;
