const covid19ImpactEstimator = (data) => {
  const input = data;
  const { reportedCases, timeToElapse, periodType, totalHospitalBeds } = input;

  function getCurrentlyInfected(factor) {
    return reportedCases * factor;
  }

  function getNumberInfectedByTime(time) {
    let durationInDays = time;
    if (periodType === 'weeks') {
      durationInDays = time * 7;
    } else if (periodType === 'months') {
      // 30.4167days is == 1month
      durationInDays = Math.trunc(time * 30.4167);
    }
    const factor = Math.trunc(durationInDays / 3);
    return 2 ** factor;
  }

  function getSevereCases(type){
    if (type === 'impact') return Math.trunc((15 * (getCurrentlyInfected(10) * getNumberInfectedByTime(timeToElapse))) / 100);
    return Math.trunc((15 * (getCurrentlyInfected(50) * getNumberInfectedByTime(timeToElapse))) / 100);
  }

  function getAvailableBeds(type){
    const availabeBeds = Math.trunc((35 * totalHospitalBeds) / 100);
    return  availabeBeds - getSevereCases(type);
  }

  return {
    data: input,
    impact: {
      currentlyInfected: getCurrentlyInfected(10),
      infectionsByRequestedTime: getCurrentlyInfected(10) * getNumberInfectedByTime(timeToElapse),
      severeCasesByRequestedTime: getSevereCases('impact'),
      hospitalBedsByRequestedTime: getAvailableBeds('impact')
    },
    severeImpact: {
      currentlyInfected: getCurrentlyInfected(50),
      infectionsByRequestedTime: getCurrentlyInfected(50) * getNumberInfectedByTime(timeToElapse),
      severeCasesByRequestedTime: getSevereCases('severeImpact'),
      hospitalBedsByRequestedTime: getAvailableBeds('severeImpact')
    }
  };
};

export default covid19ImpactEstimator;
