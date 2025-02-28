import { JobDescription } from "@/types/jobDescription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { GitBranch, GitCommit, ArrowRight, History } from "lucide-react";

interface TemplateVersionHistoryProps {
  versions: JobDescription[];
  onSelectVersion?: (version: JobDescription) => void;
  onCompareVersions?: (v1: JobDescription, v2: JobDescription) => void;
  currentVersionId?: string;
}

export function TemplateVersionHistory({
  versions,
  onSelectVersion,
  onCompareVersions,
  currentVersionId,
}: TemplateVersionHistoryProps) {
  // Sort versions by version number descending
  const sortedVersions = [...versions].sort(
    (a, b) => b.metadata.version - a.metadata.version
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Version History</h3>
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="relative">
          {/* Version Timeline */}
          <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-border" />

          <div className="space-y-4">
            {sortedVersions.map((version, index) => (
              <div
                key={version.id}
                className={`relative pl-8 ${
                  version.id === currentVersionId
                    ? "bg-accent/10 -mx-2 p-2 rounded-lg"
                    : ""
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-[11px] -translate-x-1/2 mt-1.5">
                  {version.metadata.isLatest ? (
                    <GitBranch className="h-4 w-4 text-primary" />
                  ) : (
                    <GitCommit className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {/* Version Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      Version {version.metadata.version}
                    </span>
                    {version.metadata.isLatest && (
                      <Badge variant="secondary">Latest</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(
                        new Date(version.metadata.createdAt),
                        { addSuffix: true }
                      )}
                    </span>
                  </div>

                  {/* Changes Summary */}
                  <div className="text-sm text-muted-foreground">
                    <p>{version.description}</p>
                    <p className="mt-1">
                      {version.responsibilities.length} responsibilities,{" "}
                      {version.requirements.required.length} required skills
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    {onSelectVersion && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectVersion(version)}
                      >
                        View
                      </Button>
                    )}
                    {onCompareVersions && index < sortedVersions.length - 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onCompareVersions(version, sortedVersions[index + 1])
                        }
                      >
                        <ArrowRight className="h-4 w-4 mr-1" />
                        Compare with previous
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
