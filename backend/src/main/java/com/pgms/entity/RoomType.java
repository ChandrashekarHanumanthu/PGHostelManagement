package com.pgms.entity;

public enum RoomType {
    SINGLE(1),
    DOUBLE(2),
    THREE(3),
    FOUR(4),
    FIVE(5);

    private final int capacity;

    RoomType(int capacity) {
        this.capacity = capacity;
    }

    public int getCapacity() {
        return capacity;
    }
}

