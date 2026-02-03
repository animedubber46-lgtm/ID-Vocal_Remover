
import ffmpeg from "fluent-ffmpeg";

export async function processAudio(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // "Karaoke" effect: subtract left from right channel to remove center-panned vocals
    // This is a simple approximation for "background extraction" (instrumental)
    // Note: This only works well on stereo files with centered vocals.
    ffmpeg(inputPath)
      .audioFilters('pan=stereo|c0=c0-c1|c1=c1-c0') // Phase cancellation
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .run();
  });
}
