import { useEffect, useState } from "react";

import { sleep } from "../utils/sleep";
import { Eye, EyeOff, Globe, Link as LinkIcon, Clock } from "lucide-react";
import {
  AWSRegionList,
  type AWSCredential,
  type AWSEventSource,
  type Cloud,
  type Provider,
  type ScheduleScanSetting,
} from "../types/type";
import InputField from "./commons/InputField";
import MultiSelect, { type Option } from "./commons/MultiSelect";
import RadioGroup, { type RadioOption } from "./commons/RadioGroup";

interface CloudDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: Cloud;
}

export const CloudDialog = ({
  open,
  onClose,
  initialData,
}: CloudDialogProps) => {
  const isEdit = !!initialData;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [proxyUrl, setProxyUrl] = useState("");
  const [cloudTrailName, setCloudTrailName] = useState("");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [frequency, setFrequency] = useState("DAY");
  const [hour, setHour] = useState("0");
  const [minute, setMinute] = useState("00");

  // Providers
  const [providerOptions, setProviderOptions] = useState<Option[]>([
    { value: "AWS", label: "AWS" },
    { value: "AZURE", label: "AZURE", disabled: true },
    { value: "GCP", label: "GCP", disabled: true },
  ]);
  const [selectedProvider, setSelectedProvider] = useState<Provider>("AWS");

  // Registration Method
  const [regiOptions, setRegiOptions] = useState<Option[]>([
    { value: "Access Key", label: "Access Key" },
    { value: "Assume role", label: "Assume role", disabled: true },
    { value: "Roles anywhere", label: "Roles anywhere", disabled: true },
  ]);
  const [selectedRegist, setSelectedRegist] = useState("Access Key");

  // Region
  const [regionOptions, setRegionOptions] = useState<Option[]>(
    AWSRegionList.map((v) => ({ value: v, label: v }))
  );
  const [selectedRegion, setSelectedRegion] = useState(["global"]);

  // Schedule Settings
  const [settinOptions, setSettingOptions] = useState<RadioOption[]>([
    { value: "Enabled", label: "Enabled" },
    { value: "Disabled", label: "Disabled" },
  ]);
  const [selectedSetting, setSelectedSetting] = useState("Enabled");

  // 데이터 로드
  useEffect(() => {
    if (!open) return;

    if (isEdit && initialData) {
      setLoading(true);
      sleep(Math.floor(Math.random() * 501)).then(() => {
        const cred = initialData.credentials as AWSCredential;
        const event = initialData.eventSource as AWSEventSource;
        setName(initialData.name);
        setAccessKey(cred.accessKeyId || "");
        setSecretKey(cred.secretAccessKey || "");
        setCloudTrailName(event?.cloudTrailName || "");
        setSelectedRegion(
          initialData.regionList.includes("global")
            ? initialData.regionList
            : ["global", ...initialData.regionList]
        );
        setProxyUrl(initialData.proxyUrl || "");
        setScheduleEnabled(initialData.scheduleScanEnabled || false);
        setLoading(false);
      });
    } else {
      setName("");
      setAccessKey("");
      setSecretKey("");
      setCloudTrailName("");
      setSelectedRegion(["global", "English"]);
      setProxyUrl("");
      setScheduleEnabled(false);
    }
  }, [open, isEdit, initialData]);

  // 확인 버튼 → payload 출력
  const handleSubmit = () => {
    const payload: Cloud = {
      id: initialData?.id || "",
      provider: providerOptions[0].value as Provider,
      name,
      regionList: selectedRegion,
      proxyUrl,
      cloudGroupName: ["AWS Group"],
      eventProcessEnabled: true,
      userActivityEnabled: true,
      scheduleScanEnabled: scheduleEnabled,
      scheduleScanSetting: scheduleEnabled
        ? ({ frequency, hour, minute } as ScheduleScanSetting)
        : undefined,
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
      credentialType: "ACCESS_KEY",
      eventSource: { cloudTrailName },
    };

    console.log("Payload:", payload);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[560px] max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Cloud" : "Create Cloud"}
        </h2>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : (
          <>
            {/*Cloud name 영역 */}
            <InputField
              label="Cloud Name"
              value={name}
              onChange={setName}
              placeholder="Please enter the cloud name."
            />
            {/*Provider 영역 */}
            <MultiSelect
              label={"Select Provider"}
              value={selectedProvider}
              options={providerOptions}
              onChange={() => setSelectedProvider}
            />

            {/** Key Registration 영역 */}
            <MultiSelect
              label={"Select Key Registration Method"}
              value={selectedRegist}
              options={regiOptions}
              onChange={() => setSelectedRegist}
            />
            <hr />
            {/** Credential 영역 */}
            <div>
              <p>Credentials</p>
              {/* Access Key */}
              <InputField
                label="Access Key"
                value={accessKey}
                onChange={setAccessKey}
                placeholder="Enter Access Key"
              />
              {/* Secret Key */}
              <div className="relative mb-4">
                <InputField
                  label="Secret Key"
                  type={showSecret ? "text" : "password"}
                  value={secretKey}
                  onChange={setSecretKey}
                  placeholder="Enter Secret Key"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[38px] text-gray-500"
                  onClick={() => setShowSecret((v) => !v)}
                >
                  {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <hr />
            {/** Region 영역 */}
            <MultiSelect
              label={"Region"}
              value={selectedRegion[0]}
              options={regionOptions}
              onChange={() => setSelectedRegion}
            />

            {/* Proxy URL */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1 text-sm font-semibold">
                <LinkIcon size={16} />
                <span>Proxy URL</span>
              </div>
              <InputField
                label=""
                value={proxyUrl}
                onChange={setProxyUrl}
                placeholder="Please enter the proxy URL."
              />
            </div>

            {/** Scan Schedule Seting Radion 영역 */}
            <div>
              <RadioGroup
                name={"Scan Schedules Setting"}
                label={"Scan Schedules Setting"}
                value={selectedSetting}
                options={settinOptions}
                onChange={(e) => setSelectedSetting(e)}
              />
            </div>
            {/** Set scan Frequency 영역 */}
            <div>
              <p>Set scan Frequency</p>
              <p>Scan Schedule: {"Daily 12:00"}</p>
              <MultiSelect
                value={"Daily"}
                options={[
                  { value: "HOUR", label: "HOUR" },
                  { value: "DAY", label: "DAY" },
                  { value: "WEEK", label: "WEEK" },
                  { value: "MONTH", label: "MONTH" },
                ]}
                onChange={() => ""}
              />
              {/** 세부사항 */}
              <div>
                {/** Date */}
                <MultiSelect
                  value={"1"}
                  options={[
                    { value: "1", label: "1" },
                    { value: "2...", label: "2..." },
                  ]}
                  onChange={() => ""}
                />
                {/** Day of Week */}
                <MultiSelect
                  value={"MON"}
                  options={[{ value: "MON...", label: "MON..." }]}
                  onChange={() => ""}
                />
                {/** Hour */}
                <MultiSelect
                  value={"0"}
                  options={[{ value: "0...", label: "0..." }]}
                  onChange={() => ""}
                />
                {/** Minute */}
                <MultiSelect
                  value={"0"}
                  options={[{ value: "0...", label: "0..." }]}
                  onChange={() => ""}
                />
              </div>
            </div>

            <hr />

            {/** Event Integration 영역 */}
            <div>
              <p>Event Integration</p>
              {/** NOTE: CloudTrail Name 영역 AWS, AZURE, GCP 각기 다른 내용 */}
              <InputField
                label={"CloudTrail Name"}
                value={""}
                placeholder="Please enter the cloud trail name"
                onChange={() => ""}
              />
            </div>

            {/* Cancel & Submit 버튼 영역 */}
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CloudDialog;
