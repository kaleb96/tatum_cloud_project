import { useEffect, useState } from "react";
import { sleep } from "../utils/sleep";
import { Eye, EyeOff, Link as LinkIcon, X } from "lucide-react";
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
  onSubmit: (payload: Cloud, isEdit: boolean) => void;
  initialData?: Cloud;
}

const CloudDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: CloudDialogProps) => {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [provider, setProvider] = useState<Provider>("AWS");
  const [registMethod, setRegistMethod] = useState("Access Key");
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [proxyUrl, setProxyUrl] = useState("");
  const [region, setRegion] = useState<string[]>(["global"]);
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [frequency, setFrequency] = useState("Daily");
  const [cloudTrailName, setCloudTrailName] = useState("");

  const providerOptions: Option[] = [
    { value: "AWS", label: "AWS" },
    { value: "AZURE", label: "AZURE", disabled: true },
    { value: "GCP", label: "GCP", disabled: true },
  ];
  const regiOptions: Option[] = [
    { value: "Access Key", label: "Access Key" },
    { value: "Assume Role", label: "Assume Role", disabled: true },
  ];
  const regionOptions: Option[] = AWSRegionList.map((v) => ({
    value: v,
    label: v,
  }));
  const scheduleOptions: RadioOption[] = [
    { value: "Enabled", label: "Enabled" },
    { value: "Disabled", label: "Disabled" },
  ];

  // Edit/Reset 로딩
  useEffect(() => {
    if (!open) return;
    if (isEdit && initialData) {
      setLoading(true);
      sleep(Math.floor(Math.random() * 501)).then(() => {
        const cred = initialData.credentials as AWSCredential;
        const event = initialData.eventSource as AWSEventSource;
        setName(initialData.name);
        setAccessKey(cred?.accessKeyId || "");
        setSecretKey(cred?.secretAccessKey || "");
        setCloudTrailName(event?.cloudTrailName || "");
        setProxyUrl(initialData.proxyUrl || "");
        setRegion(initialData.regionList || ["global"]);
        setScheduleEnabled(initialData.scheduleScanEnabled || false);
        setLoading(false);
      });
    } else {
      setName("");
      setAccessKey("");
      setSecretKey("");
      setProxyUrl("");
      setCloudTrailName("");
      setRegion(["global"]);
      setScheduleEnabled(true);
      setLoading(false);
    }
  }, [open, isEdit, initialData]);

  const handleSubmit = async () => {
    const payload: Cloud = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      provider,
      credentialType: "ACCESS_KEY",
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
      regionList: region,
      scheduleScanEnabled: scheduleEnabled,
      scheduleScanSetting: scheduleEnabled
        ? ({ frequency } as ScheduleScanSetting)
        : undefined,
      eventSource: { cloudTrailName },
      proxyUrl,
      cloudGroupName: ["AWS-Group"],
      eventProcessEnabled: true,
      userActivityEnabled: true,
    };

    console.log(isEdit ? "Edit Payload:" : "Create Payload:", payload);

    // ✅ 제출 UX: 0~500ms 로딩
    setSubmitting(true);
    await sleep(Math.floor(Math.random() * 501));
    onSubmit(payload, isEdit);
    setSubmitting(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-[560px] max-h-[90vh] rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Cloud" : "Create Cloud"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-200 bg-white">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading...</div>
          ) : (
            <>
              <InputField
                label="Cloud Name *"
                value={name}
                onChange={setName}
                placeholder="Please enter the cloud name."
              />

              <MultiSelect
                label="Select Provider"
                value={provider}
                options={providerOptions}
                onChange={(v) => setProvider(v as Provider)}
              />

              <MultiSelect
                label="Select Key Registration Method"
                value={registMethod}
                options={regiOptions}
                onChange={setRegistMethod}
              />

              <hr className="my-3" />
              <p className="font-medium text-sm mb-1">Credentials</p>

              <InputField
                label="Access Key"
                value={accessKey}
                onChange={setAccessKey}
                placeholder="Access Key"
              />

              <div className="relative">
                <InputField
                  label="Secret Key"
                  type={showSecret ? "text" : "password"}
                  value={secretKey}
                  onChange={setSecretKey}
                  placeholder="Secret Key"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[38px] text-gray-500"
                  onClick={() => setShowSecret((v) => !v)}
                  aria-label="toggle-secret"
                >
                  {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <MultiSelect
                label="Region"
                value={region[0]}
                options={regionOptions}
                onChange={(val) => setRegion([val])}
              />

              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1 text-sm font-medium">
                  <LinkIcon size={16} />
                  Proxy URL
                </div>
                <InputField
                  label=""
                  value={proxyUrl}
                  onChange={setProxyUrl}
                  placeholder="Please enter the proxy URL."
                />
              </div>

              <hr className="my-3" />

              <RadioGroup
                name="Scan Schedule"
                label="Scan Schedule Setting"
                value={scheduleEnabled ? "Enabled" : "Disabled"}
                options={scheduleOptions}
                onChange={(v) => setScheduleEnabled(v === "Enabled")}
              />

              <MultiSelect
                label="Set Scan Frequency"
                value={frequency}
                options={[
                  { value: "Daily", label: "Daily" },
                  { value: "Weekly", label: "Weekly" },
                ]}
                onChange={setFrequency}
              />

              <InputField
                label="CloudTrail Name"
                value={cloudTrailName}
                onChange={setCloudTrailName}
                placeholder="Please enter the cloud trail name."
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-4 py-2 rounded text-white ${
              submitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Processing..." : isEdit ? "Submit" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloudDialog;
