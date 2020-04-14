const covid19ImpactEstimator = (data) => {
  const input = data;
  const {
    reportedCases,
    timeToElapse,
    periodType,
    totalHospitalBeds
  } = input;

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

  function getSevereCases(type) {
    let infectionsByGivenTime = getCurrentlyInfected(10) * getNumberInfectedByTime(timeToElapse);
    let numberOfSevereCases = (15 * infectionsByGivenTime) / 100;
    if (type !== 'impact') {
      infectionsByGivenTime = getCurrentlyInfected(50) * getNumberInfectedByTime(timeToElapse);
      numberOfSevereCases = (15 * infectionsByGivenTime) / 100;
    }
    return Math.trunc(numberOfSevereCases);
  }

  function getAvailableBeds(type) {
    const availabeBeds = Math.trunc((35 * totalHospitalBeds) / 100);
    return availabeBeds - getSevereCases(type);
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
