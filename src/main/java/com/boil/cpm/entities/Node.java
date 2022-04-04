package com.boil.cpm.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
public class Node {

    private int id;

    private LocalDateTime start, finish;

    private int timeGapInHours;

    private List<Action> actionsOut;

    boolean critical;

    public Node() {
        actionsOut = new ArrayList<>();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getFinish() {
        return finish;
    }

    public void setFinish(LocalDateTime finish) {
        this.finish = finish;
    }

    public int getTimeGapInHours() {
        return timeGapInHours;
    }

    public void setTimeGapInHours(int timeGapInHours) {
        this.timeGapInHours = timeGapInHours;
    }

    public List<Action> getActionsOut() {
        return actionsOut;
    }

    public void setActionsOut(List<Action> actionsOut) {
        this.actionsOut = actionsOut;
    }

    public void addActionsOut(Action action){
        if(actionsOut == null)
            actionsOut = new ArrayList<>();

        actionsOut.add(action);
    }

    @Override
    public String toString() {
        return "id=" + id +
                ", actionsOut=\n" + actionsOut;
    }
}
