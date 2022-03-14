package com.boil.cpm.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
public class Node {

    private LocalDateTime start, finish;

    private int durationInHours;

    private String name;

    private String[] predecessors;

    private int timeGapInHours;

    public Node() {
    }

}
