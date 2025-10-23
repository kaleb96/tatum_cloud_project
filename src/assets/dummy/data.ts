import type { Cloud } from "../../types/type";

// --- 더미 데이터 -------------------------------------------------

export type TableCloud = Cloud & {
  organization: string;
  accountId: string;
  status: boolean;
};

export const tableDummyData: TableCloud[] = Array.from({ length: 71 }).map(
  (_, i) => {
    const prov = (["AWS", "AZURE", "GCP"] as const)[i % 3];
    const name = [
      "Dev",
      "AWS Ops",
      "Azure Dev",
      "AWS Stage",
      "GCP CX",
      "GCP Research",
      "GCP DEV",
      "prod",
    ][i % 8];
    const status = i % 6 === 4 ? false : true; // 간단한 READY/ERROR 분기

    return {
      id: `cloud-${i + 1}`,
      provider: prov,
      name,
      cloudGroupName: [`${prov}-Group`, "디폴트"],
      eventProcessEnabled: i % 5 !== 4, // VALID / INVALID
      userActivityEnabled: i % 3 === 0, // Realtime (ON/OFF)
      scheduleScanEnabled: false,
      regionList: ["global", "ap-northeast-2"],
      proxyUrl: "",
      credentials:
        prov === "AWS"
          ? {
              accessKeyId: `AKIA****${(1000 + i).toString().slice(-4)}`,
              secretAccessKey: "****",
            }
          : prov === "AZURE"
          ? {
              tenantId: `tenant-${i}`,
              subscriptionId: `sub-${i}`,
              applicationId: `app-${i}`,
              secretKey: "****",
            }
          : { projectId: `gcp-proj-${i}`, jsonText: "{...}" },
      credentialType:
        prov === "AWS"
          ? "ACCESS_KEY"
          : prov === "AZURE"
          ? "APPLICATION"
          : "JSON_TEXT",
      eventSource:
        prov === "AWS"
          ? { cloudTrailName: i % 4 === 0 ? `trail-${i}` : undefined }
          : { storageAccountName: i % 4 === 0 ? `storage-${i}` : undefined },
      // 화면에 보일 임시 필드들(스크린샷 유사)
      organization: `Org ${i % 7}`,
      accountId: `0000-${(100000 + i).toString().slice(-6)}`,
      status, // boolean → READY/ERROR
    };
  }
);
