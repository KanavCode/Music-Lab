package com.musiclab.backend.domain;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a single audio track within a music project.
 * Contains metadata and a list of AudioRegions placed on its timeline.
 * Implements Serializable for AJT Unit 2 (Java I/O) compliance.
 */
public class AudioTrack implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String trackId;
    private String name;
    private double volume;
    private boolean isMuted;
    private List<AudioRegion> regions;

    // Default constructor (required for deserialization)
    public AudioTrack() {
        this.regions = new ArrayList<>();
    }

    public AudioTrack(String trackId, String name, double volume, boolean isMuted, List<AudioRegion> regions) {
        this.trackId = trackId;
        this.name = name;
        this.volume = volume;
        this.isMuted = isMuted;
        this.regions = regions != null ? regions : new ArrayList<>();
    }

    // --- Getters & Setters ---

    public String getTrackId() {
        return trackId;
    }

    public void setTrackId(String trackId) {
        this.trackId = trackId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getVolume() {
        return volume;
    }

    public void setVolume(double volume) {
        this.volume = volume;
    }

    public boolean isMuted() {
        return isMuted;
    }

    public void setMuted(boolean muted) {
        isMuted = muted;
    }

    public List<AudioRegion> getRegions() {
        return regions;
    }

    public void setRegions(List<AudioRegion> regions) {
        this.regions = regions;
    }

    @Override
    public String toString() {
        return "AudioTrack{trackId='" + trackId + "', name='" + name + "', volume=" + volume
                + ", isMuted=" + isMuted + ", regions=" + regions + "}";
    }
}
