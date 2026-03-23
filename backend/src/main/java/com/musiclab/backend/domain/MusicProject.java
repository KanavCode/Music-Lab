package com.musiclab.backend.domain;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a complete music project (DAW session state).
 * This is the top-level domain object that gets serialized/deserialized
 * using Java I/O streams for AJT Unit 2 compliance.
 */
public class MusicProject implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String projectId;
    private String userId;
    private String projectName;
    private int bpm;
    private List<AudioTrack> tracks;

    // Default constructor (required for deserialization)
    public MusicProject() {
        this.tracks = new ArrayList<>();
    }

    public MusicProject(String projectId, String userId, String projectName, int bpm, List<AudioTrack> tracks) {
        this.projectId = projectId;
        this.userId = userId;
        this.projectName = projectName;
        this.bpm = bpm;
        this.tracks = tracks != null ? tracks : new ArrayList<>();
    }

    // --- Getters & Setters ---

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public int getBpm() {
        return bpm;
    }

    public void setBpm(int bpm) {
        this.bpm = bpm;
    }

    public List<AudioTrack> getTracks() {
        return tracks;
    }

    public void setTracks(List<AudioTrack> tracks) {
        this.tracks = tracks;
    }

    @Override
    public String toString() {
        return "MusicProject{projectId='" + projectId + "', userId='" + userId
                + "', projectName='" + projectName + "', bpm=" + bpm + ", tracks=" + tracks + "}";
    }
}
