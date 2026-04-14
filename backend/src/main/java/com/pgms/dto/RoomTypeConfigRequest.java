package com.pgms.dto;

import com.pgms.entity.RoomType;
import jakarta.validation.constraints.*;

public class RoomTypeConfigRequest {

    @NotBlank(message = "Hostel name is required")
    @Size(min = 2, max = 50, message = "Hostel name must be between 2 and 50 characters")
    private String hostelName;

    @NotNull(message = "Room type is required")
    private RoomType roomType;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotNull(message = "Rent amount is required")
    @Min(value = 0, message = "Rent amount must be positive")
    private Double rentAmount;

    @Min(value = 0, message = "Maintenance fee must be 0 or more")
    private Double maintenanceFeeAmount;

    @NotNull(message = "Total rooms is required")
    @Min(value = 1, message = "Total rooms must be at least 1")
    private Integer totalRooms;

    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    @Size(max = 1000, message = "Amenities must be less than 1000 characters")
    private String amenities;

    private Boolean isActive = true;

    // Getters and Setters
    public String getHostelName() {
        return hostelName;
    }

    public void setHostelName(String hostelName) {
        this.hostelName = hostelName;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Double getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(Double rentAmount) {
        this.rentAmount = rentAmount;
    }

    public Double getMaintenanceFeeAmount() {
        return maintenanceFeeAmount;
    }

    public void setMaintenanceFeeAmount(Double maintenanceFeeAmount) {
        this.maintenanceFeeAmount = maintenanceFeeAmount;
    }

    public Integer getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(Integer totalRooms) {
        this.totalRooms = totalRooms;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
