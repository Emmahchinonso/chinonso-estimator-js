const covid19ImpactEstimator = (data) => {
  const input = data;
  const { reportedCases, timeToElapse, periodType } = input;

  function getCurrentlyInfected(factor) {
    return reportedCases * factor;
  }

  function getNumberInfectedByTime(time) {
    let durationInDays = time;
    if (periodType == 'weeks'){
      durationInDays = time * 7;
    }else if (periodType == 'months'){
      durationInDays = time * 4 * 7;
    }
    const factor = Math.trunc( durationInDays / 3 );
    return 2 ** factor;
  }

  return {
    data: input,
    impact: {
      currentlyInfected: getCurrentlyInfected(10),
      infectionsByRequestedTime: getCurrentlyInfected(10) * getNumberInfectedByTime(timeToElapse)
    },
    severeImpact: {
      currentlyInfected: getCurrentlyInfected(50),
      infectionsByRequestedTime: getCurrentlyInfected(50) * getNumberInfectedByTime(timeToElapse)
    }
  };
};

export default covid19ImpactEstimator;
