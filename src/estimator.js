const covid19ImpactEstimator = (data) => {
  const input = data;
  const {
    reportedCases,
    timeToElapse,
    periodType,
    totalHospitalBeds
  } = input;
  const {
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation
  } = input.data.region;
  function getCurrentlyInfected(factor) {
    return reportedCases * factor;
  }

  function multiplicationFactor(time) {
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

  function infectionsByGivenTime(type) {
    let numbersInfected = getCurrentlyInfected(10) * multiplicationFactor(timeToElapse);
    if (type !== 'impact') {
      numbersInfected = getCurrentlyInfected(50) * multiplicationFactor(timeToElapse);
    }
    return numbersInfected;
  }

  function getSevereCases(type) {
    const numberOfSevereCases = (15 * infectionsByGivenTime(type)) / 100;
    return Math.trunc(numberOfSevereCases);
  }

  function getAvailableBeds(type) {
    const availabeBeds = (35 * totalHospitalBeds) / 100;
    return Math.trunc(availabeBeds - getSevereCases(type));
  }

  function getICUCases(type) {
    const numberOfICUCases = (5 * infectionsByGivenTime(type)) / 100;
    return numberOfICUCases;
  }

  function getVentilatorCases(type) {
    const numberOfVentilatorCases = (2 * infectionsByGivenTime(type)) / 100;
    return numberOfVentilatorCases;
  }

  function getDollarsInFlight(type) {
    const Loss = (infectionsByGivenTime(type) * avgDailyIncomePopulation * avgDailyIncomeInUSD);
    return Math.trunc(Loss / timeToElapse);
  }

  return {
    data: input,
    impact: {
      currentlyInfected: getCurrentlyInfected(10),
      infectionsByRequestedTime: infectionsByGivenTime('impact'),
      severeCasesByRequestedTime: getSevereCases('impact'),
      hospitalBedsByRequestedTime: getAvailableBeds('impact'),
      casesForICUByRequestedTime: getICUCases('impact'),
      casesForVentilatorsByRequestedTime: getVentilatorCases('impact'),
      dollarsInFlight: getDollarsInFlight('impact')
    },
    severeImpact: {
      currentlyInfected: getCurrentlyInfected(50),
      infectionsByRequestedTime: infectionsByGivenTime('severeImpact'),
      severeCasesByRequestedTime: getSevereCases('severeImpact'),
      hospitalBedsByRequestedTime: getAvailableBeds('severeImpact'),
      casesForICUByRequestedTime: getICUCases('severeImpact'),
      casesForVentilatorsByRequestedTime: getVentilatorCases('severeImpact'),
      dollarsInFlight: getDollarsInFlight('severeImpact')
    }
  };
};

export default covid19ImpactEstimator;
