#!/bin/bash
# 同時監測兩個部署目標，每秒一次。
# 部署時執行這支，可以直接看出「單機會斷、負載平衡不會斷」。
EC2=http://52.199.107.190
ALB=http://nkc202-cicd-alb-1176135322.ap-northeast-1.elb.amazonaws.com

printf "%-10s │ %-22s │ %-22s\n" "時間" "分頁1  EC2（單機）" "分頁2  ECS（負載平衡）"
printf "%.0s─" {1..62}; echo
FAIL_E=0; FAIL_A=0; N=0

while true; do
  T=$(date '+%H:%M:%S')
  RE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 "$EC2/healthz" 2>/dev/null || echo 000)
  RA=$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 "$ALB/healthz" 2>/dev/null || echo 000)
  VE=$(curl -s --max-time 2 "$EC2/healthz" 2>/dev/null | sed -n 's/.*"version":"\([^"]*\)".*/\1/p'); VE=${VE:-—}
  VA=$(curl -s --max-time 2 "$ALB/healthz" 2>/dev/null | sed -n 's/.*"version":"\([^"]*\)".*/\1/p'); VA=${VA:-—}
  N=$((N+1))
  [ "$RE" != "200" ] && { FAIL_E=$((FAIL_E+1)); ME="❌ 斷線"; } || ME="✅ $VE"
  [ "$RA" != "200" ] && { FAIL_A=$((FAIL_A+1)); MA="❌ 斷線"; } || MA="✅ $VA"
  printf "%-10s │ %-22s │ %-22s\n" "$T" "$ME" "$MA"
  trap 'echo; echo "── 統計 ──"; echo "  共 $N 次   EC2 失敗 $FAIL_E 次   ECS 失敗 $FAIL_A 次"; exit 0' INT
  sleep 1
done
