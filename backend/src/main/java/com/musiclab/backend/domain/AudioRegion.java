package com.musiclab.backend.domain;

import java.io.Serial;
import java.io.Serializable;

/**
 * Represents a single audio clip placed on a track timeline.
 * Implements Serializable for AJT Unit 2 (Java I/O) compliance.
 */
public class AudioRegion implements Serializable {

    @Serial
    private static final long serialVersionUID = 2L;

    private String sampleId;
    private double startTime;
    private double duration;
    private String audioFileUrl;

    // Default constructor (required for deserialization)
    public AudioRegion() {}

    public AudioRegion(String sampleId, double startTime, double duration, String audioFileUrl) {
        this.sampleId = sampleId;
        this.startTime = startTime;
        this.duration = duration;
        this.audioFileUrl = audioFileUrl;
    }

    // --- Getters & Setters ---

    public String getSampleId() {
        return sampleId;
    }

    public void setSampleId(String sampleId) {
        this.sampleId = sampleId;
    }

    public double getStartTime() {
        return startTime;
    }

    public void setStartTime(double startTime) {
        this.startTime = startTime;
    }

    public double getDuration() {
        return duration;
    }

    public void setDuration(double duration) {
        this.duration = duration;
    }

    public String getAudioFileUrl() {
        return audioFileUrl;
    }

    public void setAudioFileUrl(String audioFileUrl) {
        this.audioFileUrl = audioFileUrl;
    }

    @Override
    public String toString() {
        return "AudioRegion{sampleId='" + sampleId + "', startTime=" + startTime
                + ", duration=" + duration + ", audioFileUrl='" + audioFileUrl + "'}";
    }
}
