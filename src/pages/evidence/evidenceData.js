import { getRiskBand, seededBoolean, seededNumber } from '../../utils/dataGenerator';
import { ONE_DAY_MS, RED_FLAG_TYPES, formatShortDate, toCode, getRangeDays } from './evidenceUtils';

export const buildEvidenceAnalytics = (caseData, state, district, range) => {
  const seed = `${caseData.caseId}|${state}|${district}|${range}`;
  const rangeDays = getRangeDays(range);
  const network = caseData.evidence.network;
  const coreAccounts = [network.hubAccount, network.transitAccount, network.controllerAccount];
  const prefixBoundary = network.hubAccount.lastIndexOf('-');
  const accountPrefix = prefixBoundary > -1 ? network.hubAccount.slice(0, prefixBoundary + 1) : `${network.hubAccount}-`;
  const clusterAccountCount = Math.max(network.clusterSize, 7);
  const clusterAccounts = [...coreAccounts];

  let accountCounter = 1;
  while (clusterAccounts.length < clusterAccountCount) {
    const candidate = `${accountPrefix}${String(accountCounter).padStart(4, '0')}`;
    if (!clusterAccounts.includes(candidate)) {
      clusterAccounts.push(candidate);
    }
    accountCounter += 1;
  }

  const districtCode = toCode(district || 'DST');
  const externalAccounts = Array.from({ length: 4 }, (_, index) => `EXT-${districtCode}-${String(index + 1).padStart(3, '0')}`);

  const observedLinks = caseData.evidence.transactions.map((transaction, index) => ({
    id: transaction.transactionId,
    source: transaction.fromAccount,
    target: transaction.toAccount,
    amount: transaction.amount,
    suspicious: true,
    observed: true,
    pattern: transaction.patternTag,
    hop: index + 1
  }));

  const generatedClusterLinks = clusterAccounts.slice(3).flatMap((account, index) => {
    const target = index % 2 === 0 ? network.hubAccount : network.transitAccount;
    const amount = seededNumber(`${seed}|cluster-link-amt|${index}`, 90000, 780000);
    const linkRows = [
      {
        id: `SYN-${index + 1}`,
        source: account,
        target,
        amount,
        suspicious: amount > 420000,
        observed: false,
        pattern: index % 2 === 0 ? 'Funnel Inflow' : 'Layered Transfer',
        hop: 3 + index
      }
    ];

    if (seededBoolean(`${seed}|return-loop|${index}`, 35)) {
      linkRows.push({
        id: `SYN-RETURN-${index + 1}`,
        source: target,
        target: account,
        amount: Math.round(amount * (0.55 + seededNumber(`${seed}|return-ratio|${index}`, 10, 45) / 100)),
        suspicious: true,
        observed: false,
        pattern: 'Circular Return',
        hop: 4 + index
      });
    }

    return linkRows;
  });

  const externalLinks = externalAccounts.map((account, index) => ({
    id: `EXT-${index + 1}`,
    source: network.hubAccount,
    target: account,
    amount: seededNumber(`${seed}|external-out|${index}`, 120000, 980000),
    suspicious: seededBoolean(`${seed}|external-risk|${index}`, 48),
    observed: false,
    pattern: index % 2 === 0 ? 'Outbound Dispersion' : 'Smurfing',
    hop: 7 + index
  }));

  const networkLinks = [...observedLinks, ...generatedClusterLinks, ...externalLinks];
  const degreeMap = new Map();

  networkLinks.forEach((link) => {
    degreeMap.set(link.source, (degreeMap.get(link.source) || 0) + 1);
    degreeMap.set(link.target, (degreeMap.get(link.target) || 0) + 1);
  });

  const relationshipAccounts = [...new Set([...clusterAccounts, ...externalAccounts])];
  const networkNodes = relationshipAccounts.map((account, index) => {
    const isCore = coreAccounts.includes(account);
    const isExternal = account.startsWith('EXT-');
    const minRisk = isCore ? 72 : isExternal ? 28 : 42;
    const maxRisk = isCore ? 96 : isExternal ? 68 : 91;
    const riskScore = seededNumber(`${seed}|relationship-risk|${account}|${index}`, minRisk, maxRisk);
    const centrality = degreeMap.get(account) || 1;

    return {
      id: account,
      label: account,
      shortLabel: account.slice(-4),
      riskScore,
      riskBand: getRiskBand(riskScore),
      centrality,
      kind: isExternal ? 'external' : 'account'
    };
  });

  const linkKey = new Set(networkLinks.map((link) => `${link.source}->${link.target}`));
  const circularPairs = networkLinks.filter((link) => linkKey.has(`${link.target}->${link.source}`)).length;
  const circularRoutes = Math.max(1, Math.round(circularPairs / 2));
  const suspiciousLinks = networkLinks.filter((link) => link.suspicious).length;
  const highCentralityAccounts = [...networkNodes].sort((left, right) => right.centrality - left.centrality).slice(0, 4);

  const totalObservedFlow = caseData.evidence.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const baselineCenter = Math.max(Math.round(totalObservedFlow / Math.max(5, Math.floor(rangeDays / 2))), 110000);
  const profileStart = new Date(Date.now() - (rangeDays - 1) * ONE_DAY_MS);

  const behaviouralSeries = Array.from({ length: rangeDays }, (_, index) => {
    const at = new Date(profileStart.getTime() + index * ONE_DAY_MS);
    const weekdayWeight = [0.82, 0.94, 1.08, 1.12, 1.06, 0.96, 0.76][at.getDay()];
    const baseline = Math.round(
      seededNumber(`${seed}|baseline|${index}`, Math.round(baselineCenter * 0.6), Math.round(baselineCenter * 1.3)) *
        weekdayWeight
    );

    let amount = Math.round(baseline * (0.78 + seededNumber(`${seed}|profile-scale|${index}`, 0, 38) / 100));
    const forcedSpikeIndex = rangeDays > 10 ? rangeDays - 3 : Math.floor(rangeDays / 2);
    const isAnomaly = index === forcedSpikeIndex || seededBoolean(`${seed}|anomaly|${index}`, 11);

    if (isAnomaly) {
      amount = Math.round(baseline * (1.9 + seededNumber(`${seed}|anomaly-scale|${index}`, 0, 130) / 100));
    }

    return {
      index,
      date: at,
      label: formatShortDate(at),
      baseline,
      amount,
      isAnomaly
    };
  });

  const anomalyPoints = behaviouralSeries.filter((point) => point.isAnomaly);
  const anomalyCount = anomalyPoints.length;

  const flowSourceNodes = Array.from({ length: 4 }, (_, index) => ({
    id: `SRC-${index + 1}`,
    label: `Source ${index + 1}`,
    layer: 0,
    riskBand: 'Low'
  }));

  const flowLayerNodes = [
    { id: network.hubAccount, label: 'Hub Account', layer: 1, riskBand: 'Critical' },
    { id: network.transitAccount, label: 'Transit Account', layer: 1, riskBand: 'High' },
    { id: network.controllerAccount, label: 'Controller', layer: 2, riskBand: 'Critical' },
    { id: `LAYER-${districtCode}-1`, label: 'Layer Node 1', layer: 2, riskBand: 'High' },
    { id: `LAYER-${districtCode}-2`, label: 'Layer Node 2', layer: 2, riskBand: 'Medium' },
    { id: `EXIT-${districtCode}-1`, label: 'Exit Node 1', layer: 3, riskBand: 'Medium' },
    { id: `EXIT-${districtCode}-2`, label: 'Exit Node 2', layer: 3, riskBand: 'Low' },
    { id: `EXIT-${districtCode}-3`, label: 'Exit Node 3', layer: 3, riskBand: 'Low' }
  ];

  const flowNodes = [...flowSourceNodes, ...flowLayerNodes];

  const sourceToHubLinks = flowSourceNodes.map((node, index) => ({
    source: node.id,
    target: network.hubAccount,
    amount: seededNumber(`${seed}|src-hub|${index}`, 180000, 960000)
  }));

  const hubToTransit = {
    source: network.hubAccount,
    target: network.transitAccount,
    amount: caseData.evidence.transactions[0]?.amount || seededNumber(`${seed}|hub-transit`, 260000, 910000)
  };

  const transitToController = {
    source: network.transitAccount,
    target: network.controllerAccount,
    amount: caseData.evidence.transactions[1]?.amount || seededNumber(`${seed}|transit-controller`, 210000, 880000)
  };

  const controllerSplitLinks = [
    {
      source: network.controllerAccount,
      target: `LAYER-${districtCode}-1`,
      amount: seededNumber(`${seed}|ctrl-layer-1`, 160000, 620000)
    },
    {
      source: network.controllerAccount,
      target: `LAYER-${districtCode}-2`,
      amount: seededNumber(`${seed}|ctrl-layer-2`, 110000, 510000)
    },
    {
      source: `LAYER-${districtCode}-1`,
      target: `EXIT-${districtCode}-1`,
      amount: seededNumber(`${seed}|layer1-exit1`, 100000, 400000)
    },
    {
      source: `LAYER-${districtCode}-1`,
      target: `EXIT-${districtCode}-2`,
      amount: seededNumber(`${seed}|layer1-exit2`, 90000, 360000)
    },
    {
      source: `LAYER-${districtCode}-2`,
      target: `EXIT-${districtCode}-3`,
      amount: seededNumber(`${seed}|layer2-exit3`, 80000, 330000)
    }
  ];

  const flowLinks = [...sourceToHubLinks, hubToTransit, transitToController, ...controllerSplitLinks];
  const manyToOneTransfers = sourceToHubLinks.length;
  const layeredTransfers = controllerSplitLinks.length + 2;

  const riskWeights = {
    ml: seededNumber(`${seed}|risk-weight-ml`, 24, 36),
    network: seededNumber(`${seed}|risk-weight-network`, 22, 34),
    device: seededNumber(`${seed}|risk-weight-device`, 14, 24),
    rule: seededNumber(`${seed}|risk-weight-rule`, 16, 26)
  };

  const weightTotal = Object.values(riskWeights).reduce((sum, value) => sum + value, 0);
  const riskBreakdown = [
    { factor: 'ML Score', key: 'ml', value: Math.round((riskWeights.ml / weightTotal) * caseData.riskScore) },
    { factor: 'Network Score', key: 'network', value: Math.round((riskWeights.network / weightTotal) * caseData.riskScore) },
    { factor: 'Device Score', key: 'device', value: Math.round((riskWeights.device / weightTotal) * caseData.riskScore) },
    { factor: 'Rule Score', key: 'rule', value: Math.round((riskWeights.rule / weightTotal) * caseData.riskScore) }
  ];

  const riskDifference = caseData.riskScore - riskBreakdown.reduce((sum, factor) => sum + factor.value, 0);
  riskBreakdown[riskBreakdown.length - 1].value += riskDifference;

  const riskStacked = [
    {
      name: 'Risk Mix',
      ML: riskBreakdown.find((row) => row.key === 'ml')?.value || 0,
      Network: riskBreakdown.find((row) => row.key === 'network')?.value || 0,
      Device: riskBreakdown.find((row) => row.key === 'device')?.value || 0,
      Rule: riskBreakdown.find((row) => row.key === 'rule')?.value || 0
    }
  ];

  const redFlagFrequency = RED_FLAG_TYPES.map((flag, index) => ({
    type: flag,
    count: seededNumber(`${seed}|red-flag|${index}`, 6, 32)
  })).sort((left, right) => right.count - left.count);

  const redFlagTotal = redFlagFrequency.reduce((sum, row) => sum + row.count, 0);
  const redFlagDistribution = redFlagFrequency.map((row) => ({
    ...row,
    share: Number(((row.count / redFlagTotal) * 100).toFixed(1))
  }));

  const deviceMap = new Map();
  caseData.evidence.deviceHistory.forEach((entry) => {
    if (!deviceMap.has(entry.deviceId)) {
      deviceMap.set(entry.deviceId, new Set());
    }
    deviceMap.get(entry.deviceId).add(entry.account);
  });

  Array.from({ length: 3 }).forEach((_, index) => {
    const deviceId = `DV-${seededNumber(`${seed}|device-extra-id|${index}`, 10000, 99999)}`;
    if (!deviceMap.has(deviceId)) {
      deviceMap.set(deviceId, new Set());
    }

    const linkedCount = seededNumber(`${seed}|device-extra-linked|${index}`, 2, 4);
    for (let cursor = 0; cursor < linkedCount; cursor += 1) {
      const account = clusterAccounts[seededNumber(`${seed}|device-extra-account|${index}|${cursor}`, 0, clusterAccounts.length - 1)];
      deviceMap.get(deviceId).add(account);
    }
  });

  const accountNodeMap = new Map(networkNodes.map((node) => [node.id, node]));
  const deviceGraphNodes = [];
  const deviceGraphLinks = [];
  const seenDeviceGraphNodes = new Set();

  const addDeviceNode = (node) => {
    if (!seenDeviceGraphNodes.has(node.id)) {
      seenDeviceGraphNodes.add(node.id);
      deviceGraphNodes.push(node);
    }
  };

  deviceMap.forEach((accounts, deviceId) => {
    addDeviceNode({
      id: deviceId,
      label: deviceId,
      shortLabel: deviceId.slice(-4),
      kind: 'device',
      centrality: accounts.size + 1,
      riskBand: accounts.size > 2 ? 'High' : 'Medium'
    });

    accounts.forEach((accountId) => {
      const matchedAccount = accountNodeMap.get(accountId);
      addDeviceNode({
        id: accountId,
        label: accountId,
        shortLabel: accountId.slice(-4),
        kind: 'account',
        centrality: (matchedAccount?.centrality || 1) + 1,
        riskBand: matchedAccount?.riskBand || 'Medium'
      });

      deviceGraphLinks.push({
        source: deviceId,
        target: accountId,
        amount: seededNumber(`${seed}|device-link-weight|${deviceId}|${accountId}`, 1, 5) * 10000,
        suspicious: accounts.size > 2
      });
    });
  });

  const deviceBarData = Array.from(deviceMap.entries())
    .map(([deviceId, accounts]) => ({
      deviceId,
      accounts: accounts.size
    }))
    .sort((left, right) => right.accounts - left.accounts);

  const transactionBehaviourSeries = behaviouralSeries.map((point, index) => {
    const count = seededNumber(`${seed}|txn-count|${index}`, 8, 42);
    const creditShare = seededNumber(`${seed}|txn-credit-share|${index}`, 45, 78) / 100;
    const creditAmount = Math.round(point.amount * creditShare);
    const debitAmount = Math.max(0, point.amount - creditAmount);
    const avgAmount = Math.round(point.amount / Math.max(1, count));
    const riskScore = point.isAnomaly
      ? seededNumber(`${seed}|txn-risk-anom|${index}`, 70, 98)
      : seededNumber(`${seed}|txn-risk|${index}`, 35, 82);

    return {
      ...point,
      count,
      avgAmount,
      creditAmount,
      debitAmount,
      riskScore,
      riskBand: getRiskBand(riskScore)
    };
  });

  const transactionTotals = transactionBehaviourSeries.reduce(
    (result, row) => ({
      count: result.count + row.count,
      credit: result.credit + row.creditAmount,
      debit: result.debit + row.debitAmount,
      anomalies: result.anomalies + (row.isAnomaly ? 1 : 0)
    }),
    { count: 0, credit: 0, debit: 0, anomalies: 0 }
  );

  const velocityScore = Math.min(
    99,
    Math.round((transactionTotals.count / Math.max(1, transactionBehaviourSeries.length)) * 2.2)
  );

  const creditDebitRatio = Number((transactionTotals.credit / Math.max(1, transactionTotals.debit)).toFixed(2));

  const txnTimes = caseData.evidence.transactions.map((transaction) => transaction.createdAt).sort((left, right) => left - right);
  const avgGapMs =
    txnTimes.length > 1
      ? (txnTimes[txnTimes.length - 1] - txnTimes[0]) / Math.max(1, txnTimes.length - 1)
      : 6 * 60 * 60 * 1000;
  const avgRetentionHours = Math.max(1, Math.round(avgGapMs / (60 * 60 * 1000)));

  const anomalyScore = Math.min(
    99,
    Math.round((transactionTotals.anomalies / Math.max(1, transactionBehaviourSeries.length)) * 100)
  );

  const alertCount = seededNumber(`${seed}|alerts-total`, 14, 26);
  const workflowStatuses = ['Open', 'Under Review', 'Closed'];

  const alertRows = Array.from({ length: alertCount }, (_, index) => {
    const riskScore = seededNumber(`${seed}|alert-risk|${index}`, 36, 98);
    const severity = riskScore >= 80 ? 'High' : riskScore >= 55 ? 'Medium' : 'Low';
    const statusSeed = seededNumber(`${seed}|alert-status|${index}`, 0, workflowStatuses.length - 1);
    const workflowStatus = severity === 'High' ? (seededBoolean(`${seed}|high-open|${index}`, 68) ? 'Open' : 'Under Review') : workflowStatuses[statusSeed];
    const createdAt = new Date(Date.now() - seededNumber(`${seed}|alert-created|${index}`, 1, rangeDays * 24) * 60 * 60 * 1000);

    return {
      alertId: `ALT-${toCode(state)}-${toCode(district)}-${String(index + 1).padStart(4, '0')}`,
      riskScore,
      severity,
      workflowStatus,
      flagType: redFlagFrequency[index % redFlagFrequency.length].type,
      amount: seededNumber(`${seed}|alert-amount|${index}`, 75000, 960000),
      accountId: clusterAccounts[seededNumber(`${seed}|alert-account|${index}`, 0, clusterAccounts.length - 1)],
      createdAt
    };
  });

  const alertSeverityDistribution = [
    { severity: 'High', count: alertRows.filter((alert) => alert.severity === 'High').length },
    { severity: 'Medium', count: alertRows.filter((alert) => alert.severity === 'Medium').length },
    { severity: 'Low', count: alertRows.filter((alert) => alert.severity === 'Low').length }
  ];

  const workflowColumns = workflowStatuses.map((status) => ({
    status,
    items: alertRows
      .filter((alert) => alert.workflowStatus === status)
      .sort((left, right) => right.riskScore - left.riskScore)
      .slice(0, 7)
  }));

  const analystActions = [
    'Alert triaged',
    'KYC profile validated',
    'Counterparty verified',
    'Device linkage reviewed',
    'Escalation note added',
    'Supervisor sign-off'
  ];

  const actionTimeline = [
    ...caseData.evidence.timeline.map((event) => ({
      at: event.at,
      action: event.event,
      actor: 'System',
      channel: 'Automated'
    })),
    ...alertRows.slice(0, 8).map((alert, index) => ({
      at: new Date(alert.createdAt.getTime() + seededNumber(`${seed}|action-delay|${index}`, 30, 220) * 60 * 1000),
      action: `${analystActions[index % analystActions.length]} (${alert.alertId})`,
      actor: index % 2 === 0 ? 'Analyst' : 'Senior Analyst',
      channel: alert.workflowStatus
    }))
  ].sort((left, right) => left.at - right.at);

  const totalNetworkFlow = networkLinks.reduce((sum, link) => sum + link.amount, 0);
  const sharedDevices = deviceBarData.filter((item) => item.accounts > 1).length;
  const highPriorityAlerts = alertRows.filter((alert) => alert.severity === 'High').length;

  return {
    relationship: {
      nodes: networkNodes,
      links: networkLinks,
      suspiciousLinks,
      circularRoutes,
      highCentralityAccounts
    },
    behaviour: {
      series: behaviouralSeries,
      anomalyCount,
      spikes: anomalyPoints.sort((left, right) => right.amount - left.amount).slice(0, 5)
    },
    flow: {
      nodes: flowNodes,
      links: flowLinks,
      manyToOneTransfers,
      layeredTransfers
    },
    risk: {
      classification: getRiskBand(caseData.riskScore),
      breakdown: riskBreakdown,
      stacked: riskStacked
    },
    redFlags: {
      frequency: redFlagFrequency,
      distribution: redFlagDistribution
    },
    devices: {
      nodes: deviceGraphNodes,
      links: deviceGraphLinks,
      perDevice: deviceBarData,
      sharedDevices
    },
    alerts: {
      rows: alertRows,
      severityDistribution: alertSeverityDistribution
    },
    transactionsBehaviour: {
      series: transactionBehaviourSeries,
      kpis: {
        velocityScore,
        creditDebitRatio,
        avgRetentionHours,
        anomalyScore
      }
    },
    workflow: {
      columns: workflowColumns,
      timeline: actionTimeline
    },
    summary: {
      totalNetworkFlow,
      anomalyCount,
      highPriorityAlerts,
      sharedDevices,
      suspiciousLinks
    }
  };
};
